import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import { pregenerateWalletForEmail, sendUsdcPayout } from '@/lib/payout';

const app = getApps()[0] ?? initializeApp({
  credential: process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault(),
});
const db = getFirestore(app);
const FROM = 'hello@dressencoded.com';
const SITE_URL = process.env.SUSTAINABILITY_SITE_URL;

// POST /api/claim-code — code+email entry. The code IS the claim_codes
// doc ID (set by generate-and-send-claim-codes.mjs), so this is a direct
// get, not a query. claimedAt is set inside a transaction before any
// payout work happens — that's the idempotency lock: a retry or a race
// between two tabs both hit "already claimed" instead of double-paying.
// If the payout itself fails after the lock, the lock is rolled back so
// the same code can be retried.
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return bad('invalid_request'); }

  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!code || !email || !email.includes('@')) return bad('invalid_code_or_email');

  const docRef = db.collection('claim_codes').doc(code);

  let alreadyClaimed = false;
  let amountUsd;
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      if (!snap.exists || snap.data().email !== email) {
        throw new HttpError(404, 'invalid_code_or_email');
      }
      const data = snap.data();
      amountUsd = data.amountUsd;
      if (data.claimedAt) {
        alreadyClaimed = true;
        return;
      }
      tx.update(docRef, { claimStatus: 'processing', claimedAt: FieldValue.serverTimestamp() });
    });
  } catch (err) {
    if (err instanceof HttpError) return bad(err.error, err.status);
    console.error('claim-code transaction failed:', err);
    return bad('claim_failed', 500);
  }

  if (alreadyClaimed) {
    return NextResponse.json({ ok: true, alreadyClaimed: true });
  }

  try {
    const { address } = await pregenerateWalletForEmail(email);
    const { signature } = await sendUsdcPayout({ toAddress: address, amountUsd });
    await docRef.update({ walletAddress: address, txSignature: signature, claimStatus: 'claimed' });
    sendPayoutNotification(email, amountUsd).catch((err) =>
      console.error('claim-code notification email failed:', err)
    );
    return NextResponse.json({ ok: true, alreadyClaimed: false });
  } catch (err) {
    console.error('claim-code payout failed, rolling back lock:', err);
    await docRef.update({ claimStatus: 'failed', claimedAt: null }).catch(() => {});
    return bad('payout_failed', 500);
  }
}

async function sendPayoutNotification(email, amountUsd) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `$${amountUsd.toFixed(2)} is on its way — DRESSENCODED Pilot`,
    html: `<p>$${amountUsd.toFixed(2)} is on its way.</p>
<p>Log in at <a href="${SITE_URL}">${SITE_URL}</a> with this email to access your wallet and see it land.</p>`,
  });
}

class HttpError extends Error {
  constructor(status, error) {
    super(error);
    this.status = status;
    this.error = error;
  }
}

function bad(error, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}
