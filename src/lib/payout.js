import { PrivyClient } from '@privy-io/node';
import {
  Connection, Keypair, PublicKey, Transaction, clusterApiUrl,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress, createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction, getAccount, TokenAccountNotFoundError,
} from '@solana/spl-token';
import bs58 from 'bs58';

// Lazy, same reasoning as production's src/lib/stripe.js — avoids
// constructing at import time during Next.js build-time page-data
// collection, before Secret Manager env vars are populated.
let _privy;
function getPrivyClient() {
  if (!_privy) {
    _privy = new PrivyClient({
      appId: process.env.PRIVY_APP_ID,
      appSecret: process.env.PRIVY_APP_SECRET,
    });
  }
  return _privy;
}

// Sustainability pilot pays out in USDC on Solana.
const WALLET_CHAIN_TYPE = 'solana';
const USDC_DECIMALS = 6;
const USDC_MINT = new PublicKey(
  process.env.USDC_MINT_ADDRESS || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
);

function findEmbeddedWalletForChain(user) {
  return user.linked_accounts.find(
    (a) => a.type === 'wallet' && a.chain_type === WALLET_CHAIN_TYPE && a.wallet_client === 'privy'
  );
}

// Pregenerates (or reuses) an embedded wallet for a claim recipient identified
// only by email — they never need to sign up or install a wallet extension.
// Idempotent: re-running for the same email returns the same address instead
// of erroring or minting a second wallet.
export async function pregenerateWalletForEmail(email) {
  const privy = getPrivyClient();

  let user;
  try {
    user = await privy.users().getByEmailAddress({ address: email });
  } catch (err) {
    if (err?.status !== 404) throw err;
  }

  if (!user) {
    user = await privy.users().create({
      linked_accounts: [{ type: 'email', address: email }],
      wallets: [{ chain_type: WALLET_CHAIN_TYPE }],
    });
  } else if (!findEmbeddedWalletForChain(user)) {
    user = await privy.users().pregenerateWallets(user.id, {
      wallets: [{ chain_type: WALLET_CHAIN_TYPE }],
    });
  }

  const wallet = findEmbeddedWalletForChain(user);
  return { userId: user.id, address: wallet.address };
}

let _connection;
function getConnection() {
  if (!_connection) {
    _connection = new Connection(process.env.SOLANA_RPC_URL || clusterApiUrl('mainnet-beta'), 'confirmed');
  }
  return _connection;
}

// SUSTAINABILITY_TREASURY_WALLET_PRIVATE_KEY is a base58-encoded Solana
// secret key (Secret Manager in production, .env.local for local runs) —
// same encoding Solana CLI / Phantom export. Never log this value.
function getTreasuryKeypair() {
  const raw = process.env.SUSTAINABILITY_TREASURY_WALLET_PRIVATE_KEY;
  if (!raw) throw new Error('SUSTAINABILITY_TREASURY_WALLET_PRIVATE_KEY is not set');
  return Keypair.fromSecretKey(bs58.decode(raw));
}

// Sends a USDC payout from the treasury wallet to a recipient's pregenerated
// Privy embedded wallet address. Creates the recipient's associated token
// account if it doesn't exist yet (idempotent instruction — safe even if it
// already does). amountUsd is a dollar amount (e.g. 1.00), converted here to
// USDC's 6-decimal base units.
export async function sendUsdcPayout({ toAddress, amountUsd }) {
  const connection = getConnection();
  const treasury = getTreasuryKeypair();
  const recipient = new PublicKey(toAddress);

  const treasuryAta = await getAssociatedTokenAddress(USDC_MINT, treasury.publicKey);
  const recipientAta = await getAssociatedTokenAddress(USDC_MINT, recipient);

  try {
    await getAccount(connection, treasuryAta);
  } catch (err) {
    if (err instanceof TokenAccountNotFoundError) {
      throw new Error('Treasury wallet has no USDC associated token account — fund it first.');
    }
    throw err;
  }

  const baseUnits = Math.round(amountUsd * 10 ** USDC_DECIMALS);
  if (!Number.isFinite(baseUnits) || baseUnits <= 0) {
    throw new Error(`Invalid payout amount: ${amountUsd}`);
  }

  const tx = new Transaction().add(
    createAssociatedTokenAccountIdempotentInstruction(
      treasury.publicKey, recipientAta, recipient, USDC_MINT
    ),
    createTransferCheckedInstruction(
      treasuryAta, USDC_MINT, recipientAta, treasury.publicKey, baseUnits, USDC_DECIMALS
    )
  );

  const signature = await connection.sendTransaction(tx, [treasury]);
  await connection.confirmTransaction(signature, 'confirmed');
  return { signature };
}
