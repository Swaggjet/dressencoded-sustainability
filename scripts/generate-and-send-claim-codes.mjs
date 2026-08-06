import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { randomBytes } from 'node:crypto';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';

const FROM = 'hello@dressencoded.com';
const RATE_USD_PER_LB = 0.25;
const CEILING_USD = 5.56;
const SITE_URL = process.env.SUSTAINABILITY_SITE_URL; // e.g. https://<real-deployed-domain>/sustainability

// The already-approved pilot roster (weights verified 2026-06-21). This
// script refuses to generate or send anything if the live
// sustainability_events data no longer matches this exactly — that drift
// check is the point, not an inconvenience.
const EXPECTED_AMOUNTS_USD = {
  'Asante Simmons': 1.00,
  'Belay': 0.75,
  'Pearci Bastiany': 0.50,
  'Dendi Suhubdy': 0.50,
  'Vasanth': 1.00,
  'Érica Moseley': 0.50,
  'Karisma': 0.31,
  'Arvin bhangu': 0.50,
  'Vincent Haliburton': 0.25,
  'Hamad Kasoga': 0.25,
};

const isLive = process.argv.includes('--live');
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1

function round2(n) {
  return Math.round(n * 100) / 100;
}

function generateCode() {
  const bytes = randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) code += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  return code;
}

async function uniqueCode(db) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const snap = await db.collection('claim_codes').doc(code).get();
    if (!snap.exists) return code;
  }
  throw new Error('Failed to generate a unique code after 5 attempts');
}

async function main() {
  initializeApp({ credential: applicationDefault() });
  const db = getFirestore();

  const snap = await db.collection('sustainability_events').get();
  const eligible = snap.docs.filter((doc) => {
    const d = doc.data();
    return typeof d.name === 'string' && d.name.trim() && typeof d.email === 'string' && d.email.trim();
  });

  console.log(`Mode: ${isLive ? 'LIVE — will write codes and send real emails' : 'DRY RUN — report only, no writes, no emails'}`);
  console.log(`sustainability_events total: ${snap.size}  |  eligible (name + email present): ${eligible.length}`);
  console.log('---');

  const people = eligible.map((doc) => {
    const d = doc.data();
    const name = d.name.trim();
    return { docId: doc.id, name, email: d.email.trim().toLowerCase(), weightLbs: Number(d.weightLbs) || 0, amountUsd: round2((Number(d.weightLbs) || 0) * RATE_USD_PER_LB) };
  });

  people.forEach((p) => console.log(`  ${p.name.padEnd(20)} ${p.email.padEnd(30)} ${p.weightLbs}lb -> $${p.amountUsd.toFixed(2)}`));
  const totalUsd = round2(people.reduce((sum, p) => sum + p.amountUsd, 0));
  console.log(`Total exposure: $${totalUsd.toFixed(2)}  (ceiling: $${CEILING_USD.toFixed(2)})`);
  console.log('---');

  const expectedNames = Object.keys(EXPECTED_AMOUNTS_USD);
  const foundNames = people.map((p) => p.name);
  const missing = expectedNames.filter((n) => !foundNames.includes(n));
  const unexpected = foundNames.filter((n) => !expectedNames.includes(n));
  const drifted = people.filter((p) => expectedNames.includes(p.name) && Math.abs(p.amountUsd - EXPECTED_AMOUNTS_USD[p.name]) > 0.005);

  if (people.length !== expectedNames.length || missing.length || unexpected.length) {
    console.error(`ABORT: eligible roster doesn't match the expected ${expectedNames.length}-person pilot list.`);
    if (missing.length) console.error(`  Missing: ${missing.join(', ')}`);
    if (unexpected.length) console.error(`  Unexpected: ${unexpected.join(', ')}`);
    process.exit(1);
  }
  if (drifted.length) {
    console.error('ABORT: per-person amount drift detected vs. the already-approved figures:');
    drifted.forEach((p) => console.error(`  ${p.name}: computed $${p.amountUsd.toFixed(2)} vs. expected $${EXPECTED_AMOUNTS_USD[p.name].toFixed(2)}`));
    process.exit(1);
  }
  if (totalUsd > CEILING_USD + 0.005) {
    console.error(`ABORT: total exposure $${totalUsd.toFixed(2)} exceeds the $${CEILING_USD.toFixed(2)} pilot ceiling.`);
    process.exit(1);
  }
  console.log(`Roster matches the approved ${expectedNames.length}-person pilot list exactly. Total exposure within ceiling.`);

  if (!isLive) {
    console.log('---');
    console.log('Dry run complete. Re-run with --live to generate codes and send emails.');
    return;
  }
  if (!SITE_URL) {
    console.error('ABORT: SUSTAINABILITY_SITE_URL is not set — refusing to send emails without a real claim-page link.');
    process.exit(1);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log('---');
  for (const person of people) {
    const existing = await db.collection('claim_codes').where('eventDocId', '==', person.docId).limit(1).get();
    let code;
    if (!existing.empty) {
      code = existing.docs[0].id;
      console.log(`${person.name}: code already issued (${code}), re-sending email.`);
    } else {
      code = await uniqueCode(db);
      await db.collection('claim_codes').doc(code).set({
        code,
        email: person.email,
        name: person.name,
        weightLbs: person.weightLbs,
        amountUsd: person.amountUsd,
        eventDocId: person.docId,
        claimedAt: null,
        claimStatus: 'issued',
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log(`${person.name}: generated code ${code}.`);
    }

    await resend.emails.send({
      from: FROM,
      to: person.email,
      subject: `Claim your $${person.amountUsd.toFixed(2)} payout — [DE] DRESSENCODED Pilot`,
      html: `<p>Hi ${escapeHtml(person.name)},</p>
<p>Thanks for dropping off your textiles at the DRESSENCODED SF sustainability pilot. Your $${person.amountUsd.toFixed(2)} USDC reward is ready to claim.</p>
<p>Visit <a href="${SITE_URL}">${SITE_URL}</a>, click "Reclaim Protocol", and enter this code with the email this was sent to:</p>
<p style="font-size:20px;font-family:monospace;font-weight:bold;">${escapeHtml(code)}</p>`,
    });
    console.log(`  -> email sent to ${person.email}`);
  }

  console.log('---');
  console.log(`Done. ${people.length} code(s) issued/re-sent.`);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
