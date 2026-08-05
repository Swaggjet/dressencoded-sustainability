import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { execFileSync } from 'node:child_process';

const SECRET_NAME = 'SUSTAINABILITY_TREASURY_WALLET_PRIVATE_KEY';

// Unlike PROVENANCE_WALLET_PRIVATE_KEY (auto-bound to Firebase App Hosting's
// compute service account via apphosting.yaml), this app deploys on Vercel —
// there's no automatic IAM consumer for this secret yet. Skipping IAM
// bindings; wire read access to whatever actually needs it once decided.

function secretExists() {
  try {
    execFileSync('gcloud', ['secrets', 'describe', SECRET_NAME], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (secretExists()) {
  console.log(`Secret ${SECRET_NAME} already exists — refusing to overwrite an existing wallet. Delete it first (gcloud secrets delete ${SECRET_NAME}) if you really want a fresh one.`);
  process.exit(1);
}

const keypair = Keypair.generate();
const secretKeyBase58 = bs58.encode(keypair.secretKey);

// The private key never gets logged, returned, or written anywhere except
// piped straight into gcloud's stdin here.
execFileSync('gcloud', ['secrets', 'create', SECRET_NAME, '--data-file=-', '--replication-policy=automatic'], {
  input: secretKeyBase58,
});
console.log(`Created secret ${SECRET_NAME} in Secret Manager.`);

// Independently re-derive the address from what's actually IN Secret Manager
// (not from the in-memory keypair) to catch any write/encoding corruption.
const readBack = execFileSync('gcloud', ['secrets', 'versions', 'access', 'latest', `--secret=${SECRET_NAME}`]).toString().trim();
const rederived = Keypair.fromSecretKey(bs58.decode(readBack));

if (rederived.publicKey.toBase58() !== keypair.publicKey.toBase58()) {
  console.error('MISMATCH: the address re-derived from Secret Manager does not match the generated keypair. Do not fund this wallet — delete the secret and investigate.');
  process.exit(1);
}

console.log('Verified: address re-derived from Secret Manager matches the generated keypair.');
console.log(`\nTreasury wallet address (public, safe to share — do not fund until told to):\n${keypair.publicKey.toBase58()}`);
