'use client';

export default function PullQuote() {
  const styles = {
    wrap: {
      background: '#cac9d1',
      padding: '0 40px 60px',
    },
    quote: {
      padding: '32px 40px 32px 32px',
      borderLeft: '4px solid #6c3794',
      backgroundColor: '#ffffff',
      maxWidth: '900px',
      margin: '0 auto',
      borderRadius: '0 4px 4px 0',
    },
    text: {
      fontSize: '17px',
      fontStyle: 'italic',
      color: '#2c2c2a',
      marginBottom: '12px',
      lineHeight: '1.7',
    },
    attribution: {
      fontSize: '12px',
      color: '#888780',
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.quote}>
        <p style={styles.text}>
          "We build infrastructure for garments to be upgraded, resold, and recycled properly — and
          for the people who are proud to make sustainability their ultimate style."
        </p>
        <p style={styles.attribution}>— Circular Couture Founding Principle</p>
      </div>
    </div>
  );
}

