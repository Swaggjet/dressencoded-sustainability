'use client';

export default function Pillars() {
  const styles = {
    section: {
      padding: '60px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: '#cac9d1',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
    },
    card: {
      padding: '28px 24px',
      border: '1.5px solid #3DDC84',
      borderRadius: '4px',
      backgroundColor: '#494475',
      transition: 'all 0.3s ease',
    },
    number: {
      fontSize: '22px',
      fontFamily: "'Bebas Neue', sans-serif",
      fontWeight: 700,
      color: '#AFA9EC',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '14px',
      fontWeight: 600,
      marginBottom: '10px',
      color: '#ffffff',
    },
    cardText: {
      fontSize: '12px',
      color: '#CECBF6',
      lineHeight: '1.7',
    },
  };

  const pillars = [
    { num: '01', title: 'Hardware-Verified Passports', text: "Turning static garments into verified nodes for lifetime upkeep and recycling, directly combating the fashion industry's 20% global pollution output." },
    { num: '02', title: 'Responsible Lifecycle Badges', text: "Earn status recognition for your garment's longevity. This badge updates as you responsibly care for, extend the life of, or ultimately recycle your pieces through the network." },
    { num: '03', title: 'The Circular Return', text: 'A responsible exit strategy. When a garment finally reaches its physical limit, its materials are routed toward advanced upcycling to eliminate waste.' },
    { num: '04', title: 'The Circular Cash Loop', text: 'Participating in the ecosystem unlocks community perks and points towards NODE Credit rewards, fueling a greener lifecycle.' },
  ];

  return (
    <section style={styles.section}>
      <div style={styles.grid}>
        {pillars.map((p, i) => (
          <div key={i} style={styles.card}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1D9E75'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#3DDC84'; }}>
            <div style={styles.number}>{p.num}</div>
            <h3 style={styles.cardTitle}>{p.title}</h3>
            <p style={styles.cardText}>{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

