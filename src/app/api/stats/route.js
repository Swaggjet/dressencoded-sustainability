import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = getApps()[0] ?? initializeApp({
  credential: process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault(),
});
const db = getFirestore(app);

const EVENT_ID = 'SF-2026-06-21';

export async function GET() {
  // Equality-only filter (no orderBy) so this doesn't need a composite index.
  const snap = await db
    .collection('sustainability_events')
    .where('eventId', '==', EVENT_ID)
    .get();

  let totalLbs = 0;
  let latestLbs = 0;
  let latestAt = 0;
  snap.forEach((doc) => {
    const data = doc.data();
    const lbs = Number(data.weightLbs) || 0;
    totalLbs += lbs;
    const at = data.joinedAt?.toMillis?.() ?? 0;
    if (at >= latestAt) {
      latestAt = at;
      latestLbs = lbs;
    }
  });

  return NextResponse.json({ totalLbs, latestLbs, count: snap.size });
}
