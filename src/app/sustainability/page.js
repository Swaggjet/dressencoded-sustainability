'use client';

import { useState } from 'react';
import Navbar from '@/components/sustainability/Navbar';
import Hero from '@/components/sustainability/Hero';
import Pillars from '@/components/sustainability/Pillars';
import PullQuote from '@/components/sustainability/PullQuote';
import HowItWorks from '@/components/sustainability/HowItWorks';
import FooterCTA from '@/components/sustainability/FooterCTA';
import DropForm from '@/components/sustainability/DropForm';
import DropSuccess from '@/components/sustainability/DropSuccess';

export default function SustainabilityPage() {
  const [modal, setModal] = useState('none');
  return (
    <div style={{ background: '#cac9d1', minHeight: '100vh' }}>
      <Navbar />
      <Hero onCTAClick={() => setModal('form')} />
      <Pillars />
      <PullQuote />
      <HowItWorks />
      <FooterCTA onDropSiteClick={() => setModal('form')} />
      {modal === 'form' && <DropForm onSuccess={() => setModal('success')} onClose={() => setModal('none')} />}
      {modal === 'success' && <DropSuccess onClose={() => setModal('none')} />}
    </div>
  );
}

