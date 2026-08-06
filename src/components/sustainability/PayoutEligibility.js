'use client';

import { useEffect, useState } from 'react';

// Site-wide accrued total — same for every visitor regardless of who has
// actually claimed a payout. See /api/payout-eligibility for the formula.
// Renders as a continuation of AquariNode's card, not its own bordered box.
export default function PayoutEligibility({ onClaimClick }) {
  const [stats, setStats] = useState({ totalAccruedUsd: 0, dropsVerified: 0 });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/payout-eligibility')
      .then((res) => (res.ok ? res.json() : { totalAccruedUsd: 0, dropsVerified: 0 }))
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats({ totalAccruedUsd: 0, dropsVerified: 0 });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const styles = {
    label: {
      fontSize: '11px',
      color: '#6c3794',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      marginTop: '28px',
      marginBottom: '16px',
      fontWeight: 600,
      opacity: 0.8,
    },
    stats: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' },
    stat: {
      backgroundColor: 'rgba(108, 55, 148, 0.06)',
      padding: '14px',
      borderRadius: '4px',
      borderLeft: '2px solid #6c3794',
    },
    statLabel: { fontSize: '10px', color: '#5f5e5a', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' },
    statValue: { fontSize: '22px', fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#6c3794' },
    button: {
      width: '100%', padding: '14px', backgroundColor: '#6c3794', border: 'none', borderRadius: '4px',
      color: '#ffffff', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 700,
      letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
    },
  };

  return (
    <>
      <div style={styles.label}>[ Payout Eligibility ]</div>
      <div style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Accrued From Recorded Drops</div>
          <div style={styles.statValue}>${stats.totalAccruedUsd.toFixed(2)}</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Drops Verified</div>
          <div style={styles.statValue}>{stats.dropsVerified}</div>
        </div>
      </div>
      <button style={styles.button} onClick={onClaimClick}>→ Claim Payout</button>
    </>
  );
}
