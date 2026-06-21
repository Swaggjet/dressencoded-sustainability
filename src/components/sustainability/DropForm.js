'use client';
import { useState } from 'react';

const GARMENT_TYPES = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'synthetic', label: 'Synthetic' },
  { value: 'blend', label: 'Blend' },
  { value: 'leather', label: 'Leather' },
  { value: 'other', label: 'Other' },
];

export default function DropForm({ onSuccess, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', weightLbs: '', garmentType: '' });
  const [status, setStatus] = useState('idle');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const input = {
    width: '100%', padding: '12px 16px', backgroundColor: '#f5f4f8',
    border: '1px solid rgba(108,55,148,0.25)', borderRadius: '4px', color: '#2c2c2a',
    fontSize: '14px', fontFamily: "'DM Mono', monospace", outline: 'none', boxSizing: 'border-box',
  };

  async function submit() {
    if (!form.name || !form.email || !form.weightLbs || !form.garmentType) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, weightLbs: Number(form.weightLbs) }),
      });
      if (!res.ok) throw new Error();
      setStatus('idle'); onSuccess();
    } catch { setStatus('error'); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(60,52,80,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '2px solid #6c3794', borderRadius: '4px', padding: '40px 36px', width: '100%', maxWidth: '460px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '18px', background: 'none', border: 'none', color: 'rgba(108,55,148,0.5)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        <div style={{ fontSize: '11px', color: '#2e7d32', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Aquari Node — SF 6-21-26</div>
        <div style={{ fontSize: '24px', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, color: '#6c3794', marginBottom: '8px' }}>Register Your Drop</div>
        <p style={{ fontSize: '12px', color: '#5f5e5a', marginBottom: '28px', lineHeight: '1.6' }}>Log your legacy waste. Earn your Circular Provenance on-chain.</p>

        {[['name', 'Full Name', 'text', 'Your name'], ['email', 'Email', 'email', 'you@example.com'], ['phone', 'Phone', 'tel', 'Optional'], ['weightLbs', 'Estimated Weight (lbs)', 'number', 'e.g. 4.5']].map(([k, label, type, ph]) => (
          <div key={k} style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</label>
            <input style={input} type={type} placeholder={ph} value={form[k]} onChange={set(k)} />
          </div>
        ))}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Textile / Garment Type</label>
          <select style={input} value={form.garmentType} onChange={set('garmentType')}>
            <option value="" disabled>Select type</option>
            {GARMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <button onClick={submit} disabled={status === 'submitting'}
          style={{ width: '100%', padding: '14px', backgroundColor: '#6c3794', border: 'none', borderRadius: '4px', color: '#ffffff', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: status === 'submitting' ? 'not-allowed' : 'pointer', opacity: status === 'submitting' ? 0.7 : 1 }}>
          {status === 'submitting' ? 'Registering...' : '→ Submit Drop'}
        </button>
        {status === 'error' && <p style={{ fontSize: '11px', color: '#A32D2D', marginTop: '10px', textAlign: 'center' }}>Something went wrong — please try again.</p>}
      </div>
    </div>
  );
}

