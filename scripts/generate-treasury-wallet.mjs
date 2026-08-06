import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Mints a brand-new Solana keypair for the sustainability treasury
// wallet. Guarded: refuses to run if SUSTAINABILITY_TREASURY_WALLET_PRIVATE_KEY
// is already set locally, since a treasury wallet already exists in
// Secret Manager (confirmed intact 2026-08-05, address
// 5qJiXMEcgrWjngE17G3DYbsLR6AC6FYJc9TJvBTgRtvo) — running this again
// without --force would mint a wallet nobody funds and orphan the real
// one's private key from this tooling.
const force = process.argv.includes('--force');

if (process.env.SUSTAINABILITY_TREASURY_WALLET_PRIVATE_KEY && !force) {
  console.error(
    'SUSTAINABILITY_TREASURY_WALLET_PRIVATE_KEY is already set locally. ' +
    'A treasury wallet already exists — refusing to generate a replacement. ' +
    'Re-run with --force only if you are certain you want a new wallet.'
  );
  process.exit(1);
}

const keypair = Keypair.generate();
const privateKeyBase58 = bs58.encode(keypair.secretKey);
const publicAddress = keypair.publicKey.toBase58();

console.log('New treasury wallet generated.');
console.log(`Public address: ${publicAddress}`);
console.log('');
console.log('Private key (base58) — store it in Secret Manager, then clear your shell history:');
console.log(privateKeyBase58);
console.log('');
console.log('To store it:');
console.log(`  printf '%s' '${privateKeyBase58}' | gcloud secrets create SUSTAINABILITY_TREASURY_WALLET_PRIVATE_KEY --data-file=- --project=dressencoded`);
console.log('');
console.log('Fund this address with USDC (and a small amount of SOL for transaction fees) before any payouts are sent.');
