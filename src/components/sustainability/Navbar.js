'use client';

// PILOT SHELL — stripped nav, recolored to match DRESSENCODED Circular Couture palette
// TODO: reconnect — when sustainability arm merges back into platform,
// replace this component with the shared DRESSENCODED Navbar or platform auth context.

export default function Navbar() {
  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      borderBottom: '2px solid rgba(201, 168, 76, 0.5)',
      background: '#cac9d1',
    },
    left: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    logo: {
      fontSize: '20px',
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 700,
      letterSpacing: '2px',
      color: '#6c3794',
      lineHeight: 1,
    },
    sub: {
      fontSize: '10px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: 'rgba(108, 55, 148, 0.6)',
      fontWeight: 500,
    },
    badge: {
      fontSize: '10px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: '#2e7d32',
      fontWeight: 600,
      fontFamily: "'DM Mono', monospace",
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.logo}>[DE] DRESSENCODED</div>
        <div style={styles.sub}>Circular Couture</div>
      </div>
      <div style={styles.badge}>Pilot — NYC 2026</div>
    </nav>
  );
}

