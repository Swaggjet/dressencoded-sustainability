import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import crypto from 'crypto';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';

const PILOT_EVENT_ID = 'SF - 6 - 21 -26 Pilot';
const RATE_PER_LB = 0.25;
const APPROVED_CEILING_USDC = 5.56; // confirmed real total across all 10 participants
const FROM = 'hello@dressencoded.com';
const CLAIM_URL = 'https://dressencoded-sustainability.vercel.app/sustainability';
// Unambiguous charset — no 0/O/1/I/l — codes are read off a phone screen or typed by hand.
const CODE_CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const isLive = process.argv.includes('--live');

const app = getApps()[0] ?? initializeApp({
  credential: process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault(),
});
const db = getFirestore(app);
// Lazy — dry runs never send, and shouldn't require RESEND_API_KEY to be set.
let _resend;
const resend = () => (_resend ??= new Resend(process.env.RESEND_API_KEY));

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function generateCode(existing) {
  let code;
  do {
    code = Array.from({ length: 6 }, () => CODE_CHARSET[crypto.randomInt(CODE_CHARSET.length)]).join('');
  } while (existing.has(code));
  existing.add(code);
  return code;
}

async function main() {
  const snap = await db.collection('sustainability_events')
    .where('eventId', '==', PILOT_EVENT_ID)
    .where('telemetryStatus', '==', 'LINKED_AND_VERIFIED')
    .get();

  const existingCodes = new Set(snap.docs.map((d) => d.data().claimCode).filter(Boolean));
  const pending = snap.docs.filter((d) => !d.data().claimCode);
  const totalUsdc = snap.docs.reduce((sum, d) => sum + Number(d.data().weightLbs || 0) * RATE_PER_LB, 0);

  console.log(`Mode: ${isLive ? 'LIVE — will write codes and send real emails' : 'DRY RUN — no writes, no emails'}`);
  console.log(`Verified records: ${snap.size}  |  Already coded: ${snap.size - pending.length}  |  Pending: ${pending.length}`);
  console.log(`Total accrued across all verified records: $${totalUsdc.toFixed(2)} (approved ceiling: $${APPROVED_CEILING_USDC})`);
  console.log('---');

  if (totalUsdc > APPROVED_CEILING_USDC + 0.005) {
    console.error(`ABORT: total accrued $${totalUsdc.toFixed(2)} exceeds the approved $${APPROVED_CEILING_USDC} ceiling.`);
    process.exit(1);
  }

  for (const doc of pending) {
    const d = doc.data();
    const garment = d.garments?.[0]?.title || 'your recycled garment';
    const accruedUsdc = Number((Number(d.weightLbs || 0) * RATE_PER_LB).toFixed(2));
    const code = generateCode(existingCodes);

    console.log(`${isLive ? 'CODING+SENDING' : 'WOULD CODE+SEND'} -> ${d.email}  (${d.name || 'unknown'})  code=${code}  amount=$${accruedUsdc}  garment="${garment}"`);

    if (isLive) {
      await doc.ref.update({ claimCode: code, accruedUsdc });
      await resend().emails.send({
        from: FROM,
        to: d.email,
        subject: `Claim your $${accruedUsdc.toFixed(2)} payout — [DE] DRESSENCODED Pilot`,
        html: `<p>Hi ${escapeHtml(d.name || 'there')},</p>
<p>Thanks for dropping off "${escapeHtml(garment)}" at the DRESSENCODED SF sustainability pilot. Your $${accruedUsdc.toFixed(2)} USDC reward is ready to claim.</p>
<p>Visit <a href="${CLAIM_URL}">${CLAIM_URL}</a>, click <strong>CLAIM PAYOUT</strong>, and enter:</p>
<p>Your code: <strong style="font-size:20px;letter-spacing:2px;">${code}</strong><br/>Your email: ${escapeHtml(d.email)}</p>`,
      });
    }
  }

  console.log('---');
  console.log(isLive
    ? `Done. ${pending.length} code(s) generated and email(s) sent.`
    : `Dry run complete. Re-run with --live to actually write codes and send.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
