'use client';

import { useEffect, useState } from 'react';

// Site-wide aggregate, not personal — the same "example figures" pattern as
// the rest of AquariNode's stat grid. Per-participant amounts only ever
// surface inside the claim modal, after a valid code+email.
export default function PayoutEligibility({ onClaimClick }) {
  const [data, setData] = useState({ accruedUsdc: 0, dropsVerified: 0 });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/payout-eligibility')
      .then((res) => (res.ok ? res.json() : { accruedUsdc: 0, dropsVerified: 0 }))
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setData({ accruedUsdc: 0, dropsVerified: 0 }); });
    return () => { cancelled = true; };
  }, []);

  const styles = {
    wrap: { marginTop: '24px' },
    label: {
      fontSize: '11px', color: '#6c3794', letterSpacing: '1.5px', textTransform: 'uppercase',
      marginBottom: '10px', fontWeight: 600, opacity: 0.8,
    },
    box: {
      backgroundColor: '#e8e4f5', border: '1px solid rgba(108,55,148,0.25)', borderRadius: '4px',
      padding: '18px 20px', marginBottom: '14px', textAlign: 'center',
    },
    boxLabel: { fontSize: '10px', color: '#5f5e5a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' },
    amount: { fontSize: '32px', fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#6c3794', marginBottom: '6px' },
    verified: { fontSize: '12px', color: '#5f5e5a' },
    button: {
      width: '100%', padding: '14px', backgroundColor: '#6c3794', border: 'none', borderRadius: '4px',
      color: '#ffffff', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 700,
      letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>[ Payout Eligibility ]</div>
      <div style={styles.box}>
        <div style={styles.boxLabel}>Accrued From Recorded Drops</div>
        <div style={styles.amount}>${data.accruedUsdc.toFixed(2)}</div>
        <div style={styles.verified}>{data.dropsVerified} drops verified</div>
      </div>
      <button style={styles.button} onClick={onClaimClick}>→ Claim Payout</button>
    </div>
  );
}
