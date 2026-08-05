import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = getApps()[0] ?? initializeApp({
  credential: process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault(),
});
const db = getFirestore(app);

const PILOT_EVENT_ID = 'SF - 6 - 21 -26 Pilot';
const RATE_PER_LB = 0.25;

// GET /api/payout-eligibility — site-wide aggregate for the PAYOUT
// ELIGIBILITY card. Not personalized; per-participant amounts are only
// revealed via the code+email claim modal.
export async function GET() {
  const snap = await db.collection('sustainability_events')
    .where('eventId', '==', PILOT_EVENT_ID)
    .where('telemetryStatus', '==', 'LINKED_AND_VERIFIED')
    .get();

  const accruedUsdc = snap.docs.reduce((sum, d) => sum + Number(d.data().weightLbs || 0) * RATE_PER_LB, 0);

  return NextResponse.json({
    accruedUsdc: Number(accruedUsdc.toFixed(2)),
    dropsVerified: snap.size,
  });
}
