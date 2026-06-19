'use client';

export default function Hero({ onCTAClick }) {
  const styles = {
    hero: {
      padding: '80px 40px',
      textAlign: 'center',
      borderBottom: '2px solid rgba(201, 168, 76, 0.4)',
      background: '#cac9d1',
    },
    label: {
      fontSize: '11px',
      color: '#2e7d32',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '16px',
      fontWeight: 600,
    },
    h1: {
      fontSize: '48px',
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 700,
      letterSpacing: '1px',
      lineHeight: '1.15',
      marginBottom: '20px',
      color: '#6c3794',
      maxWidth: '700px',
      margin: '0 auto 20px',
    },
    intro: {
      fontSize: '15px',
      color: '#3a3848',
      maxWidth: '650px',
      margin: '0 auto 36px',
      lineHeight: '1.8',
    },
    cta: {
      display: 'inline-block',
      padding: '14px 36px',
      border: 'none',
      backgroundColor: '#6c3794',
      color: '#ffffff',
      fontSize: '12px',
      fontFamily: "'DM Mono', monospace",
      fontWeight: 700,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <section style={styles.hero}>
      <div style={styles.label}>Our Commitment</div>
      <h1 style={styles.h1}>Circular Couture</h1>
      <p style={styles.intro}>
        The only place your style makes the world greener by becoming the antidote to the landfill
        and polluted waterways.
      </p>
      {onCTAClick && (
        <button
          style={styles.cta}
          onClick={onCTAClick}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#534AB7'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = '#6c3794'; }}
        >
          → Register Your Drop
        </button>
      )}
    </section>
  );
}

