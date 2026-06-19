'use client';

import { useState } from 'react';
import FlowCards from './FlowCards';
import AquariNode from './AquariNode';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const styles = {
    section: {
      padding: '60px 40px',
      maxWidth: '1400px',
      margin: '0 auto',
      background: '#cac9d1',
    },
    title: {
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      marginBottom: '8px',
      color: '#2e7d32',
      textAlign: 'center',
    },
    rule: {
      height: '1.5px',
      background: '#2e7d32',
      opacity: 0.4,
      width: '100%',
      marginBottom: '40px',
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      alignItems: 'center',
    },
  };

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>How the Circular Protocol Works</h2>
      <div style={styles.rule} />
      <div style={styles.container}>
        <FlowCards activeStep={activeStep} setActiveStep={setActiveStep} />
        <AquariNode activeStep={activeStep} />
      </div>
    </section>
  );
}

