'use client';
import { use, useEffect, useState } from 'react';

const cardStyle = { backgroundColor: '#ffffff', border: '2px solid #6c3794', borderRadius: '4px', padding: '40px 36px', width: '100%', maxWidth: '460px' };
const headlineStyle = { fontSize: '26px', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, color: '#6c3794', marginBottom: '14px' };
const bodyStyle = { fontSize: '13px', color: '#5f5e5a', lineHeight: '1.7', marginBottom: '20px' };
const inputStyle = {
  width: '100%', padding: '12px 16px', backgroundColor: '#f5f4f8',
  border: '1px solid rgba(108,55,148,0.25)', borderRadius: '4px', color: '#2c2c2a',
  fontSize: '14px', fontFamily: "'DM Mono', monospace", outline: 'none', boxSizing: 'border-box',
};
const buttonStyle = (disabled) => ({
  width: '100%', padding: '14px', backgroundColor: '#6c3794', border: 'none', borderRadius: '4px',
  color: '#ffffff', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 700,
  letterSpacing: '1.5px', textTransform: 'uppercase', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1,
});

function Page({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#cac9d1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={cardStyle}>{children}</div>
    </div>
  );
}

export default function ClaimPage({ params }) {
  const { docId } = use(params);
  const [status, setStatus] = useState('loading');
  const [garmentTitle, setGarmentTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [wallet, setWallet] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetch(`/api/claim-usdc?docId=${encodeURIComponent(docId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return setStatus('notfound');
        setGarmentTitle(d.garmentTitle);
        setAmount(d.amountUsdc);
        setStatus(d.alreadyClaimed ? 'already' : 'ready');
      })
      .catch(() => setStatus('error'));
  }, [docId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/claim-usdc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, userWalletAddress: wallet.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'claim_failed');
      setResult(data);
    } catch (err) {
      setSubmitError(err.message === 'invalid_wallet_address' ? 'That doesn’t look like a valid wallet address.' : 'Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'loading') return <Page><div style={headlineStyle}>Loading…</div></Page>;
  if (status === 'notfound') return <Page><div style={headlineStyle}>Not Found</div><p style={bodyStyle}>This claim link is invalid or has expired.</p></Page>;
  if (status === 'error') return <Page><div style={headlineStyle}>Error</div><p style={bodyStyle}>Something went wrong loading this claim.</p></Page>;
  if (status === 'already' && !result) return <Page><div style={headlineStyle}>Already Claimed</div><p style={bodyStyle}>This reward has already been claimed.</p></Page>;

  if (result) {
    return (
      <Page>
        <div style={{ fontSize: '11px', color: '#2e7d32', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Reward Sent</div>
        <div style={headlineStyle}>Claim Successful</div>
        <p style={bodyStyle}>${result.amountPaid.toFixed(2)} USDC sent for &ldquo;{result.garment}&rdquo;.</p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(108,55,148,0.06)', border: '1px solid rgba(108,55,148,0.3)', borderRadius: '4px', padding: '12px 22px' }}>
          <div style={{ fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Transaction</div>
          <div style={{ fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#1D9E75', wordBreak: 'break-all' }}>{result.signature}</div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div style={{ fontSize: '11px', color: '#2e7d32', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>DRESSENCODED Sustainability Pilot</div>
      <div style={headlineStyle}>Claim Your Reward</div>
      <p style={bodyStyle}>${amount.toFixed(2)} USDC for &ldquo;{garmentTitle}&rdquo;.</p>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>USDC Wallet Address</label>
        <input style={{ ...inputStyle, marginBottom: '18px' }} value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder="Solana wallet address" required />
        {submitError && <p style={{ fontSize: '11px', color: '#A32D2D', marginBottom: '14px' }}>{submitError}</p>}
        <button type="submit" style={buttonStyle(submitting)} disabled={submitting}>{submitting ? 'Processing…' : '→ Claim Reward'}</button>
      </form>
    </Page>
  );
}
