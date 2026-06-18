'use client';

import Link from 'next/link';

export default function FooterCTA() {
  const styles = {
    section: {
      padding: '80px 40px',
      textAlign: 'center',
      borderTop: '1px solid rgba(245, 196, 0, 0.2)',
      background: 'linear-gradient(180deg, rgba(13, 13, 26, 1) 0%, rgba(20, 20, 35, 1) 100%)',
    },
    title: {
      fontSize: '32px',
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '24px',
      color: '#f5c400',
    },
    text: {
      fontSize: '14px',
      color: '#aaaaaa',
      marginBottom: '32px',
      letterSpacing: '0.5px',
    },
    group: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    button: {
      padding: '14px 32px',
      border: '2px solid #f5c400',
      backgroundColor: 'transparent',
      color: '#f5c400',
      fontSize: '12px',
      fontFamily: "'DM Mono', monospace",
      fontWeight: 600,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderRadius: '4px',
    },
  };

  const handleHover = (e) => {
    e.target.style.backgroundColor = '#f5c400';
    e.target.style.color = '#0d0d1a';
  };

  const handleLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = '#f5c400';
  };

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Ready to Upgrade?</h2>
      <p style={styles.text}>Join the circular economy. Mint your closet. Prove your environmental authority.</p>
      <div style={styles.group}>
        <button style={styles.button} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
          → Find a Drop Site
        </button>
        <Link href="/caviar-card">
          <button style={styles.button} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            ⟳ Reclaim Protocol
          </button>
        </Link>
        <Link href="/">
          <button style={styles.button} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            → Join DRESSENCODED
          </button>
        </Link>
      </div>
    </section>
  );
}
