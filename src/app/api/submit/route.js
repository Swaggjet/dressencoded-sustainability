import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const app = getApps()[0] ?? initializeApp({
  // App Hosting / Cloud Run give you ADC for free — no key to ship.
  // Elsewhere (e.g. Vercel), set FIREBASE_SERVICE_ACCOUNT (server-only env).
  credential: process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault(),
});
const db = getFirestore(app);

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return bad('json'); }

  const { name, email, phone, weightLbs } = body ?? {};
  if (typeof name !== 'string' || !name.trim()) return bad('name');
  if (typeof email !== 'string' || !email.includes('@') || email.length > 200) return bad('email');
  if (typeof phone !== 'string') return bad('phone');
  const weight = Number(weightLbs);
  if (!Number.isFinite(weight) || weight <= 0 || weight > 1000) return bad('weightLbs');

  await db.collection('sustainability_events').add({
    name: name.trim().slice(0, 120),
    email: email.trim().slice(0, 200),
    phone: phone.trim().slice(0, 40),
    weightLbs: weight,
    eventId: 'NYC-2026-06', // set server-side, never trusted from client
    joinedAt: FieldValue.serverTimestamp(),
  });
  return NextResponse.json({ ok: true });
}

function bad(field) {
  return NextResponse.json({ ok: false, error: field }, { status: 400 });
}
