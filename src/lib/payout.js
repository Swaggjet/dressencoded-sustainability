import { PrivyClient } from '@privy-io/node';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
} from '@solana/spl-token';

const USDC_DECIMALS = 6;
// Public address only — safe to hardcode. Generated via
// scripts/generate-treasury-wallet.mjs; private key lives in Secret
// Manager (SUSTAINABILITY_TREASURY_WALLET_PRIVATE_KEY) and is not loaded
// here at all, since this module never signs or sends.
const TREASURY_WALLET_PUBLIC_KEY = '5qJiXMEcgrWjngE17G3DYbsLR6AC6FYJc9TJvBTgRtvo';

let _privy;
function privy() {
  return (_privy ??= new PrivyClient({ appId: process.env.PRIVY_APP_ID, appSecret: process.env.PRIVY_APP_SECRET }));
}

// Pregenerates a self-custodial Solana wallet for `email` — this call alone
// makes the wallet "exist" (address returned synchronously, no webhook or
// login wait required). The participant claims custody later by logging in
// with this same email via Privy's own client-side widget.
async function pregenerateSolanaWallet(email) {
  const user = await privy().users().create({
    linked_accounts: [{ type: 'email', address: email }],
    wallets: [{ chain_type: 'solana', wallet_index: 0 }],
  });
  const solanaWallet = user.linked_accounts?.find((a) => a.type === 'wallet' && a.chain_type === 'solana');
  if (!solanaWallet?.address) {
    throw new Error('Privy did not return a Solana wallet address for the pregenerated user — check SDK response shape.');
  }
  return solanaWallet.address;
}

// Builds (but does not sign or send) the USDC transferChecked transaction.
// Stops short of loading the treasury private key entirely — that only
// happens once funding is confirmed and the send is actually wired up.
async function buildUsdcTransferTransaction({ recipientAddress, accruedUsdc }) {
  const rpcUrl = process.env.SOLANA_RPC_URL;
  const usdcMint = process.env.USDC_MINT_ADDRESS;
  if (!rpcUrl || !usdcMint) {
    throw new Error('Missing SOLANA_RPC_URL / USDC_MINT_ADDRESS env vars.');
  }

  const connection = new Connection(rpcUrl, 'confirmed');
  const mint = new PublicKey(usdcMint);
  const treasury = new PublicKey(TREASURY_WALLET_PUBLIC_KEY);
  const recipient = new PublicKey(recipientAddress);

  const treasuryAta = await getAssociatedTokenAddress(mint, treasury);
  const recipientAta = await getAssociatedTokenAddress(mint, recipient);
  const amountBaseUnits = Math.round(accruedUsdc * 10 ** USDC_DECIMALS);

  const tx = new Transaction().add(
    createAssociatedTokenAccountIdempotentInstruction(treasury, recipientAta, recipient, mint),
    createTransferCheckedInstruction(treasuryAta, mint, recipientAta, treasury, amountBaseUnits, USDC_DECIMALS),
  );
  tx.feePayer = treasury;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  return tx;
}

// Non-money part of Task 3: pregenerate the wallet (real) and build the
// transfer (real, unsigned). The only thing NOT happening here is loading
// the treasury private key and broadcasting — that stays stubbed until
// funding is explicitly confirmed. Nothing here writes claimedAt; that
// write belongs exclusively to the code path that actually sends.
export async function pregenerateWalletAndPreparePayout({ docId, email, accruedUsdc }) {
  const recipientAddress = await pregenerateSolanaWallet(email);
  const tx = await buildUsdcTransferTransaction({ recipientAddress, accruedUsdc });

  console.warn('[payout] Transfer built but NOT signed or sent — treasury key not loaded, funding not yet confirmed.', {
    docId,
    recipientAddress,
    accruedUsdc,
    instructionCount: tx.instructions.length,
  });

  return { recipientAddress, sent: false };
}
