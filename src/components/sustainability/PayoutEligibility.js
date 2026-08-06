'use client';

import { useEffect, useState } from 'react';

// Site-wide accrued total — same for every visitor regardless of who has
// actually claimed a payout. See /api/payout-eligibility for the formula.
export default function PayoutEligibility() {
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
    stats: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' },
    stat: {
      backgroundColor: 'rgba(108, 55, 148, 0.06)',
      padding: '14px',
      borderRadius: '4px',
      borderLeft: '2px solid #6c3794',
    },
    statLabel: { fontSize: '10px', color: '#5f5e5a', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' },
    statValue: { fontSize: '22px', fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#6c3794' },
  };

  return (
    <div style={styles.display}>
      <div style={styles.label}>[ Payout Eligibility — Site-Wide ]</div>
      <div style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Accrued Total</div>
          <div style={styles.statValue}>${stats.totalAccruedUsd.toFixed(2)}</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Drops Verified</div>
          <div style={styles.statValue}>{stats.dropsVerified}</div>
        </div>
      </div>
    </div>
  );
}
