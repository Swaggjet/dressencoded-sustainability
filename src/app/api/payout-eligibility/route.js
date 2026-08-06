import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = getApps()[0] ?? initializeApp({
  credential: process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault(),
});
const db = getFirestore(app);

const EVENT_ID = 'SF - 6 - 21 -26 Pilot';
const RATE_USD_PER_LB = 0.25;

// GET /api/payout-eligibility — site-wide accrued total, unchanged
// regardless of who has actually claimed. Sums every recorded drop's
// weightLbs x $0.25/lb; this is the same formula PayoutEligibility.js
// displays and generate-and-send-claim-codes.mjs uses per-claim.
export async function GET() {
  const snap = await db
    .collection('sustainability_events')
    .where('eventId', '==', EVENT_ID)
    .get();

  let totalLbs = 0;
  snap.forEach((doc) => {
    totalLbs += Number(doc.data().weightLbs) || 0;
  });

  const totalAccruedUsd = Math.round(totalLbs * RATE_USD_PER_LB * 100) / 100;
  return NextResponse.json({ totalAccruedUsd, dropsVerified: snap.size });
}
