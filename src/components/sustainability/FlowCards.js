'use client';

export default function FlowCards({ activeStep, setActiveStep }) {
  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '16px' },
    card: {
      padding: '24px',
      border: '1.5px solid rgba(108, 55, 148, 0.3)',
      borderRadius: '4px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    cardActive: {
      border: '2px solid #3DDC84',
      backgroundColor: '#494475',
    },
    number: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      backgroundColor: '#6c3794',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '15px',
      marginBottom: '12px',
    },
    title: { fontSize: '15px', fontWeight: 600, marginBottom: '8px' },
    text: { fontSize: '13px', lineHeight: '1.6' },
  };

  const steps = [
    { num: '01', title: 'Drop-Off Legacy Waste', desc: 'Bring synthetic clothing to any Aquari Node. Kiosks register materials by weight.' },
    { num: '02', title: 'The On-Chain Fork', desc: 'Swipe your wallet over the kiosk. Mint tokens or trade for NTAG hardware tokens.' },
    { num: '03', title: 'Mint Your Closet', desc: 'Prove participation in planetary cleanup. Your Circular Provenance becomes on-chain authority.' },
  ];

  return (
    <div style={styles.container}>
      {steps.map((step, i) => {
        const active = activeStep === i;
        return (
          <div key={i}
            style={{ ...styles.card, ...(active ? styles.cardActive : {}) }}
            onClick={() => setActiveStep(i)}>
            <div style={styles.number}>{step.num}</div>
            <h3 style={{ ...styles.title, color: active ? '#ffffff' : '#6c3794' }}>{step.title}</h3>
            <p style={{ ...styles.text, color: active ? '#CECBF6' : '#3a3848' }}>{step.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

