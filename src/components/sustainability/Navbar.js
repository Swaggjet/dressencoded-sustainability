'use client';

import Link from 'next/link';

export default function Navbar() {
  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      borderBottom: '1px solid rgba(245, 196, 0, 0.2)',
    },
    logo: {
      fontSize: '20px',
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 700,
      letterSpacing: '2px',
      color: '#f5c400',
    },
    navLinks: {
      display: 'flex',
      gap: '32px',
      fontSize: '12px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    navLink: {
      color: '#cccccc',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>[DE] DRESSENCODED</div>
      <div style={styles.navLinks}>
        <Link href="/home" style={styles.navLink}>HOME</Link>
        <Link href="/closet" style={styles.navLink}>CLOSET</Link>
        <Link href="/marketplace" style={styles.navLink}>MARKETPLACE</Link>
        <a href="#sustainability" style={styles.navLink}>SUSTAINABILITY</a>
      </div>
    </nav>
  );
}
