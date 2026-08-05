'use client';
import { useState } from 'react';

const ERROR_COPY = {
  invalid_code_or_email: 'That code and email don’t match one of our records. Double check the email from your reward email.',
  already_claimed: 'This code has already been claimed.',
  missing_fields: 'Enter both your code and email.',
  email_send_failed: 'We verified your code but couldn’t send your confirmation email. Please try again shortly.',
};

export default function ClaimModal({ onClose }) {
  const [form, setForm] = useState({ code: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const input = {
    width: '100%', padding: '12px 16px', backgroundColor: '#f5f4f8',
    border: '1px solid rgba(108,55,148,0.25)', borderRadius: '4px', color: '#2c2c2a',
    fontSize: '14px', fontFamily: "'DM Mono', monospace", outline: 'none', boxSizing: 'border-box',
  };

  async function submit() {
    if (!form.code || !form.email) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/claim-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(ERROR_COPY[data.error] || 'Something went wrong — please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg('Something went wrong — please try again.');
      setStatus('error');
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(60,52,80,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '2px solid #6c3794', borderRadius: '4px', padding: '40px 36px', width: '100%', maxWidth: '460px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '18px', background: 'none', border: 'none', color: 'rgba(108,55,148,0.5)', fontSize: '18px', cursor: 'pointer' }}>✕</button>

        {status === 'success' ? (
          <>
            <div style={{ fontSize: '11px', color: '#2e7d32', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Code Verified</div>
            <div style={{ fontSize: '24px', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, color: '#6c3794', marginBottom: '14px' }}>Payment on the Way</div>
            <p style={{ fontSize: '13px', color: '#5f5e5a', lineHeight: '1.7', marginBottom: '28px' }}>
              Check your email for a wallet setup link — once your wallet is ready, your USDC reward will be sent automatically.
            </p>
            <button onClick={onClose}
              style={{ padding: '14px 32px', border: '2px solid #6c3794', backgroundColor: 'transparent', color: '#6c3794', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px', width: '100%' }}>
              Close
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '11px', color: '#2e7d32', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>DRESSENCODED Sustainability Pilot</div>
            <div style={{ fontSize: '24px', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, color: '#6c3794', marginBottom: '8px' }}>Claim Payout</div>
            <p style={{ fontSize: '12px', color: '#5f5e5a', marginBottom: '28px', lineHeight: '1.6' }}>Enter the code and email from your reward email.</p>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Claim Code</label>
              <input style={{ ...input, textTransform: 'uppercase', letterSpacing: '2px' }} type="text" placeholder="XXXXXX" value={form.code} onChange={set('code')} />
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Email</label>
              <input style={input} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>

            <button onClick={submit} disabled={status === 'submitting'}
              style={{ width: '100%', padding: '14px', backgroundColor: '#6c3794', border: 'none', borderRadius: '4px', color: '#ffffff', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: status === 'submitting' ? 'not-allowed' : 'pointer', opacity: status === 'submitting' ? 0.7 : 1 }}>
              {status === 'submitting' ? 'Verifying...' : '→ Submit'}
            </button>
            {status === 'error' && <p style={{ fontSize: '11px', color: '#A32D2D', marginTop: '10px', textAlign: 'center' }}>{errorMsg}</p>}
          </>
        )}
      </div>
    </div>
  );
}
