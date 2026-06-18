'use client';

import { useState } from 'react';
import FlowCards from './FlowCards';
import AquariNode from './AquariNode';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const styles = {
    section: {
      padding: '80px 40px',
      maxWidth: '1400px',
      margin: '0 auto',
      borderTop: '1px solid rgba(245, 196, 0, 0.2)',
    },
    title: {
      fontSize: '32px',
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '60px',
      color: '#f5c400',
      textAlign: 'center',
      borderBottom: '2px solid #f5c400',
      paddingBottom: '20px',
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '80px',
      alignItems: 'center',
      marginTop: '60px',
    },
  };

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>How the Circular Protocol Works</h2>
      <div style={styles.container}>
        <FlowCards activeStep={activeStep} setActiveStep={setActiveStep} />
        <AquariNode activeStep={activeStep} />
      </div>
    </section>
  );
}
