'use client';
import { useState } from 'react';

export default function ClaimModal({ onClose }) {
  const [form, setForm] = useState({ code: '', email: '' });
  const [status, setStatus] = useState('idle');
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.code, email: form.email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus(data.error === 'invalid_code_or_email' ? 'invalid' : 'error');
        return;
      }
      setStatus(data.alreadyClaimed ? 'already-claimed' : 'success');
    } catch {
      setStatus('error');
    }
  }

  const done = status === 'success' || status === 'already-claimed';

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(60,52,80,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '2px solid #6c3794', borderRadius: '4px', padding: '40px 36px', width: '100%', maxWidth: '460px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '18px', background: 'none', border: 'none', color: 'rgba(108,55,148,0.5)', fontSize: '18px', cursor: 'pointer' }}>✕</button>

        {done ? (
          <>
            <div style={{ fontSize: '36px', marginBottom: '20px', color: '#1D9E75', textAlign: 'center' }}>◆</div>
            <div style={{ fontSize: '11px', color: '#2e7d32', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600, textAlign: 'center' }}>
              {status === 'already-claimed' ? 'Already Claimed' : 'Reclaim Protocol'}
            </div>
            <div style={{ fontSize: '24px', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, color: '#6c3794', marginBottom: '18px', textAlign: 'center' }}>
              Payment on the way
            </div>
            <p style={{ fontSize: '12px', color: '#5f5e5a', lineHeight: '1.7', textAlign: 'center' }}>
              Your USDC reward is being sent to your wallet. It should confirm shortly.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '11px', color: '#2e7d32', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Reclaim Protocol</div>
            <div style={{ fontSize: '24px', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, color: '#6c3794', marginBottom: '8px' }}>Claim Your Payout</div>
            <p style={{ fontSize: '12px', color: '#5f5e5a', marginBottom: '28px', lineHeight: '1.6' }}>Enter the code from your claim email, along with the email it was sent to.</p>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Claim Code</label>
              <input style={{ ...input, textTransform: 'uppercase' }} type="text" placeholder="e.g. 7QK3PXWM" value={form.code} onChange={set('code')} />
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Email</label>
              <input style={input} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>

            <button onClick={submit} disabled={status === 'submitting'}
              style={{ width: '100%', padding: '14px', backgroundColor: '#6c3794', border: 'none', borderRadius: '4px', color: '#ffffff', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: status === 'submitting' ? 'not-allowed' : 'pointer', opacity: status === 'submitting' ? 0.7 : 1 }}>
              {status === 'submitting' ? 'Verifying...' : '→ Claim Payout'}
            </button>
            {status === 'invalid' && <p style={{ fontSize: '11px', color: '#A32D2D', marginTop: '10px', textAlign: 'center' }}>Code and email don&apos;t match — check your claim email.</p>}
            {status === 'error' && <p style={{ fontSize: '11px', color: '#A32D2D', marginTop: '10px', textAlign: 'center' }}>Something went wrong — please try again.</p>}
          </>
        )}
      </div>
    </div>
  );
}
