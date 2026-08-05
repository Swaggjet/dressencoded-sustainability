import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import { pregenerateWalletAndPreparePayout } from '@/lib/payout';

const app = getApps()[0] ?? initializeApp({
  credential: process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault(),
});
const db = getFirestore(app);

const FROM = 'hello@dressencoded.com';
const SITE_URL = 'https://dressencoded-sustainability.vercel.app/sustainability';

let _resend;
const resend = () => (_resend ??= new Resend(process.env.RESEND_API_KEY));

async function sendWalletReadyEmail({ email, accruedUsdc }) {
  await resend().emails.send({
    from: FROM,
    to: email,
    subject: `Your $${accruedUsdc.toFixed(2)} is on its way — DRESSENCODED Pilot`,
    html: `<p>Your $${accruedUsdc.toFixed(2)} USDC reward is on its way.</p>
<p>Visit <a href="${SITE_URL}">${SITE_URL}</a> and log in with this email to access your wallet.</p>`,
  });
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!code || !email) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });

  const snap = await db.collection('sustainability_events')
    .where('claimCode', '==', code)
    .limit(1)
    .get();

  // Deliberately generic error for both "no such code" and "email doesn't
  // match" — don't tell an attacker which half of the pair was wrong.
  if (snap.empty || (snap.docs[0].data().email || '').trim().toLowerCase() !== email) {
    return NextResponse.json({ error: 'invalid_code_or_email' }, { status: 404 });
  }

  const doc = snap.docs[0];
  const data = doc.data();
  if (data.claimedAt) {
    return NextResponse.json({ error: 'already_claimed' }, { status: 409 });
  }

  // Real, sent immediately — doesn't wait on treasury funding. Unlike the
  // payout-prep step below, a failure here is worth surfacing: if we can't
  // even email them, the claim shouldn't report success.
  try {
    await sendWalletReadyEmail({ email: data.email, accruedUsdc: data.accruedUsdc });
  } catch (err) {
    console.error('[claim-code] wallet-ready email failed to send:', err.message);
    return NextResponse.json({ error: 'email_send_failed' }, { status: 502 });
  }

  // Real up through building the unsigned transfer transaction. Doesn't
  // block the response — if Privy isn't configured yet, log it and move on;
  // the participant still gets their email and the code stays claimable.
  try {
    await pregenerateWalletAndPreparePayout({ docId: doc.id, email: data.email, accruedUsdc: data.accruedUsdc });
  } catch (err) {
    console.error('[claim-code] payout preparation failed (non-fatal, email already sent):', err.message);
  }

  return NextResponse.json({ success: true, accruedUsdc: data.accruedUsdc });
}
