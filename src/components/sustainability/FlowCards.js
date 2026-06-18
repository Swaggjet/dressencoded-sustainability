'use client';

export default function FlowCards({ activeStep, setActiveStep }) {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    card: {
      padding: '32px',
      border: '1px solid rgba(245, 196, 0, 0.2)',
      borderRadius: '4px',
      backgroundColor: 'rgba(245, 196, 0, 0.02)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    cardActive: {
      border: '2px solid #f5c400',
      backgroundColor: 'rgba(245, 196, 0, 0.15)',
      boxShadow: '0 0 20px rgba(245, 196, 0, 0.3)',
    },
    number: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: '#f5c400',
      color: '#0d0d1a',
      fontWeight: 700,
      fontSize: '18px',
      marginBottom: '16px',
    },
    title: {
      fontSize: '16px',
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 700,
      letterSpacing: '1px',
      marginBottom: '12px',
      color: '#f5c400',
      textTransform: 'uppercase',
    },
    text: {
      fontSize: '13px',
      color: '#cccccc',
      lineHeight: '1.7',
    },
  };

  const steps = [
    { num: '01', title: 'Drop-Off Legacy Waste', desc: 'Bring synthetic clothing to any Aquari Node. Kiosks register materials by weight.' },
    { num: '02', title: 'The On-Chain Fork', desc: 'Swipe your wallet over the kiosk. Mint tokens or trade for NTAG hardware tokens.' },
    { num: '03', title: 'Mint Your Closet', desc: 'Prove participation in planetary cleanup. Your Circular Provenance becomes on-chain authority.' },
  ];

  return (
    <div style={styles.container}>
      {steps.map((step, i) => (
        <div key={i} style={{ ...styles.card, ...(activeStep === i ? styles.cardActive : {}) }} onClick={() => setActiveStep(i)}>
          <div style={styles.number}>{step.num}</div>
          <h3 style={styles.title}>{step.title}</h3>
          <p style={styles.text}>{step.desc}</p>
        </div>
      ))}
    </div>
  );
}
