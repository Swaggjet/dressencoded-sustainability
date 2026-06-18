'use client';

export default function AquariNode({ activeStep }) {
  const styles = {
    display: {
      padding: '48px 40px',
      backgroundColor: '#1a1a2e',
      border: '2px solid #f5c400',
      borderRadius: '4px',
      position: 'relative',
      overflow: 'hidden',
    },
    label: {
      fontSize: '11px',
      color: '#f5c400',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '32px',
      fontWeight: 600,
      opacity: 0.8,
    },
    screen: {
      backgroundColor: 'rgba(245, 196, 0, 0.15)',
      border: '1px solid #f5c400',
      borderRadius: '4px',
      padding: '24px',
      marginBottom: '32px',
      textAlign: 'center',
    },
    screenLabel: {
      fontSize: '11px',
      color: '#f5c400',
      letterSpacing: '1px',
      marginBottom: '8px',
      opacity: 0.7,
    },
    weight: {
      fontSize: '48px',
      fontFamily: "'DM Mono', monospace",
      fontWeight: 700,
      color: '#f5c400',
      letterSpacing: '2px',
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
    },
    stat: {
      backgroundColor: 'rgba(245, 196, 0, 0.08)',
      padding: '16px',
      borderRadius: '4px',
      borderLeft: '2px solid #f5c400',
    },
    statLabel: {
      fontSize: '10px',
      color: '#aaaaaa',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginBottom: '8px',
    },
    statValue: {
      fontSize: '16px',
      fontFamily: "'DM Mono', monospace",
      fontWeight: 700,
      color: '#f5c400',
    },
  };

  return (
    <div style={styles.display}>
      <div style={styles.label}>[ AQUARI INGESTION NODE: AZ-04 ]</div>
      <div style={styles.screen}>
        <div style={styles.screenLabel}>INGESTING LOAD...</div>
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
          <div style={{ ...styles.statValue, color: '#63c41a' }}>ACTIVE</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>On-Chain Impact Log</div>
          <div style={{ ...styles.statValue, fontSize: '14px' }}>0x71C...8A9f</div>
        </div>
      </div>
    </div>
  );
}
