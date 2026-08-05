import { NextResponse } from 'next/server';
import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = getApps()[0] ?? initializeApp({
  credential: process.env.FIREBASE_SERVICE_ACCOUNT
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : applicationDefault(),
});
const db = getFirestore(app);

// Flat pilot reward — not garment resale value.
const AMOUNT_USDC = 0.25;

function garmentTitleFrom(data) {
  return data.garments?.[0]?.title || 'your recycled garment';
}

// GET /api/claim-usdc?docId=... — lets /claim/[docId] render garment +
// claimability before the visitor submits a wallet address.
export async function GET(request) {
  const docId = new URL(request.url).searchParams.get('docId');
  if (!docId) return NextResponse.json({ error: 'missing_docId' }, { status: 400 });

  const snap = await db.collection('sustainability_events').doc(docId).get();
  if (!snap.exists) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const data = snap.data();
  return NextResponse.json({
    garmentTitle: garmentTitleFrom(data),
    amountUsdc: AMOUNT_USDC,
    alreadyClaimed: Boolean(data.claimedAt),
    claimable: data.telemetryStatus === 'LINKED_AND_VERIFIED' && !data.claimedAt,
  });
}

// POST /api/claim-usdc — doc-ID-keyed and transactional so a double
// submit (or two tabs) can't double-pay the same sustainability_events doc.
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const { docId, userWalletAddress } = body ?? {};
  const wallet = typeof userWalletAddress === 'string' ? userWalletAddress.trim() : '';

  if (typeof docId !== 'string' || !docId || !wallet) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet)) {
    return NextResponse.json({ error: 'invalid_wallet_address' }, { status: 400 });
  }

  const ref = db.collection('sustainability_events').doc(docId);

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { status: 404, body: { error: 'not_found' } };

    const data = snap.data();
    if (data.telemetryStatus !== 'LINKED_AND_VERIFIED' || data.claimedAt) {
      return { status: 409, body: { error: 'not_claimable' } };
    }

    const garmentTitle = garmentTitleFrom(data);
    // Placeholder devnet proof — no real Solana transfer wired up yet.
    const txSignature = `5xM${Math.random().toString(36).slice(2, 12)}_devnet_proof`;

    tx.update(ref, {
      telemetryStatus: 'CLAIMED',
      claimedAt: new Date().toISOString(),
      transactionSignature: txSignature,
      payoutAmountUsdc: AMOUNT_USDC,
      payoutRecipient: wallet,
    });

    return {
      status: 200,
      body: { success: true, signature: txSignature, amountPaid: AMOUNT_USDC, garment: garmentTitle },
    };
  });

  return NextResponse.json(result.body, { status: result.status });
}
