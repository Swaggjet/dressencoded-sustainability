'use client';

export default function DropSuccess({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(60,52,80,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', border: '2px solid #6c3794', borderRadius: '4px', padding: '48px 36px', width: '100%', maxWidth: '460px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '20px', color: '#6c3794' }}>◆</div>
        <div style={{ fontSize: '11px', color: '#2e7d32', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>Drop Registered</div>
        <div style={{ fontSize: '26px', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, color: '#6c3794', marginBottom: '14px' }}>Circular Provenance Logged</div>
        <p style={{ fontSize: '13px', color: '#5f5e5a', lineHeight: '1.7', marginBottom: '32px' }}>
          Your drop has been registered to the NYC 2026 pilot.<br />Your Circular Provenance is pending on-chain confirmation.
        </p>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(108,55,148,0.06)', border: '1px solid rgba(108,55,148,0.3)', borderRadius: '4px', padding: '12px 22px', marginBottom: '28px' }}>
          <div style={{ fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Circular Provenance</div>
          <div style={{ fontSize: '14px', fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#1D9E75' }}>ACTIVE</div>
        </div>
        <br />
        <button onClick={onClose}
          onMouseEnter={e => { e.target.style.backgroundColor = '#6c3794'; e.target.style.color = '#ffffff'; }}
          onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#6c3794'; }}
          style={{ padding: '14px 32px', border: '2px solid #6c3794', backgroundColor: 'transparent', color: '#6c3794', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>
          → Back to Circular Couture
        </button>
      </div>
    </div>
  );
}

