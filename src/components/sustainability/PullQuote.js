'use client';

export default function PullQuote() {
  const styles = {
    quote: {
      padding: '40px 40px 40px 32px',
      borderLeft: '4px solid #f5c400',
      backgroundColor: 'rgba(245, 196, 0, 0.05)',
      maxWidth: '800px',
      margin: '60px auto',
      textAlign: 'center',
    },
    text: {
      fontSize: '18px',
      fontStyle: 'italic',
      color: '#ffffff',
      marginBottom: '16px',
      lineHeight: '1.8',
      letterSpacing: '0.5px',
    },
    attribution: {
      fontSize: '11px',
      color: '#f5c400',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
  };

  return (
    <div style={styles.quote}>
      <p style={styles.text}>
        "We do not sell subscriptions to trends. We build infrastructure for garments that last — and for the people who are proud to own them."
      </p>
      <p style={styles.attribution}>— DRESSENCODED Founding Principle</p>
    </div>
  );
}
