'use client';

export default function FooterCTA({ onDropSiteClick }) {
  const btn = {
    padding: '14px 32px', border: '2px solid #6c3794', backgroundColor: 'transparent',
    color: '#6c3794', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 600,
    letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
  };
  const ghost = { ...btn, border: '2px solid rgba(108,55,148,0.25)', color: 'rgba(108,55,148,0.4)', cursor: 'not-allowed' };

  return (
    <section style={{ padding: '60px 40px', textAlign: 'center', background: '#cac9d1', borderTop: '2px solid rgba(201,168,76,0.4)' }}>
      <h2 style={{ fontSize: '26px', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, letterSpacing: '1px', marginBottom: '16px', color: '#6c3794' }}>
        Ready to Upgrade?
      </h2>
      <p style={{ fontSize: '14px', color: '#3a3848', marginBottom: '28px' }}>
        Join the circular economy. Drop your legacy waste. Earn your Circular Provenance.
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={btn} onClick={onDropSiteClick}
          onMouseEnter={e => { e.target.style.backgroundColor = '#6c3794'; e.target.style.color = '#ffffff'; }}
          onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#6c3794'; }}>
          → Register Your Drop
        </button>
        <button style={ghost} disabled>⟳ Reclaim Protocol</button>
        <button style={ghost} disabled>→ Join DRESSENCODED</button>
      </div>
    </section>
  );
}

