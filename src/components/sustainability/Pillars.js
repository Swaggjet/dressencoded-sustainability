'use client';

export default function Pillars() {
  const styles = {
    section: {
      padding: '80px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '30px',
    },
    card: {
      padding: '40px 32px',
      border: '1px solid rgba(245, 196, 0, 0.25)',
      borderRadius: '4px',
      backgroundColor: 'rgba(245, 196, 0, 0.03)',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      cursor: 'pointer',
    },
    icon: {
      fontSize: '32px',
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '14px',
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 700,
      letterSpacing: '1px',
      marginBottom: '16px',
      color: '#f5c400',
      textTransform: 'uppercase',
    },
    cardText: {
      fontSize: '12px',
      color: '#cccccc',
      lineHeight: '1.7',
    },
  };

  const pillars = [
    { icon: '◆', title: 'Smart Provenance', text: 'Every garment carries a permanent ownership chain. No receipts lost, no history erased.' },
    { icon: '↻', title: 'Circular by Design', text: 'When a piece moves to a new owner, the chain grows — incentivizing resale over disposal.' },
    { icon: '▢', title: 'Buy Less. Own More.', text: 'A DRESSENCODED piece is not a purchase — it is an investment.' },
    { icon: '⬟', title: 'The Garment as a Node', text: 'Smart Chassis garments connect to a living network that increases value over time.' },
  ];

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Our Four Pillars</h2>
      <div style={styles.grid}>
        {pillars.map((p, i) => (
          <div key={i} style={styles.card} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f5c400';
            e.currentTarget.style.backgroundColor = 'rgba(245, 196, 0, 0.08)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(245, 196, 0, 0.25)';
            e.currentTarget.style.backgroundColor = 'rgba(245, 196, 0, 0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={styles.icon}>{p.icon}</div>
            <h3 style={styles.cardTitle}>{p.title}</h3>
            <p style={styles.cardText}>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
