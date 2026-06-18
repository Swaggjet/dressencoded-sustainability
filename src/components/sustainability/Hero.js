'use client';

export default function Hero() {
  const styles = {
    hero: {
      padding: '100px 40px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(245, 196, 0, 0.2)',
      background: 'linear-gradient(180deg, rgba(13, 13, 26, 1) 0%, rgba(20, 20, 35, 1) 100%)',
    },
    label: {
      fontSize: '11px',
      color: '#f5c400',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '24px',
      fontWeight: 600,
    },
    h1: {
      fontSize: '64px',
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 700,
      letterSpacing: '3px',
      lineHeight: '1.1',
      marginBottom: '32px',
      textTransform: 'uppercase',
      maxWidth: '800px',
      margin: '0 auto 32px',
    },
    intro: {
      fontSize: '16px',
      color: '#aaaaaa',
      maxWidth: '700px',
      margin: '0 auto',
      lineHeight: '1.9',
      fontStyle: 'italic',
      letterSpacing: '0.5px',
    },
  };

  return (
    <section style={styles.hero}>
      <div style={styles.label}>Our Commitment</div>
      <h1 style={styles.h1}>Fashion That<br />Remembers</h1>
      <p style={styles.intro}>
        The fashion industry is the second largest polluter on earth. DressEncoded was built on a single counter-premise: that a garment
        with a verified identity, a provenance chain, and a network of owners is a garment worth keeping.
      </p>
    </section>
  );
}
