'use client';

export default function AquariNode({ activeStep }) {
  const styles = {
    display: {
      padding: '36px 32px',
      backgroundColor: '#ffffff',
      border: '2px solid #6c3794',
      borderRadius: '4px',
    },
    label: {
      fontSize: '11px',
      color: '#6c3794',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      marginBottom: '24px',
      fontWeight: 600,
      opacity: 0.8,
    },
    screen: {
      backgroundColor: '#494475',
      border: '1px solid #6c3794',
      borderRadius: '4px',
      padding: '20px',
      marginBottom: '24px',
      textAlign: 'center',
    },
    screenLabel: { fontSize: '11px', color: '#AFA9EC', letterSpacing: '1px', marginBottom: '6px' },
    weight: { fontSize: '40px', fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#ffffff' },
    stats: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' },
    stat: {
      backgroundColor: 'rgba(108, 55, 148, 0.06)',
      padding: '14px',
      borderRadius: '4px',
      borderLeft: '2px solid #6c3794',
    },
    statLabel: { fontSize: '10px', color: '#5f5e5a', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' },
    statValue: { fontSize: '15px', fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#6c3794' },
  };

  return (
    <div style={styles.display}>
      <div style={styles.label}>[ Aquari Ingestion Node: AZ-04 ]</div>
      <div style={styles.screen}>
        <div style={styles.screenLabel}>Ingesting load...</div>
        <div style={styles.weight}>4.2 kg</div>
      </div>
      <div style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Wallet Net Waste Cleared</div>
          <div style={styles.statValue}>28.4 kg</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Water Footprint Offset</div>
          <div style={styles.statValue}>558K L</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Circular Provenance</div>
          <div style={{ ...styles.statValue, color: '#1D9E75' }}>ACTIVE</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>On-Chain Impact Log</div>
          <div style={{ ...styles.statValue, fontSize: '13px' }}>0x71C...8A9f</div>
        </div>
      </div>
    </div>
  );
}

