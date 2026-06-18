import Navbar from '@/components/sustainability/Navbar';
import Hero from '@/components/sustainability/Hero';
import Pillars from '@/components/sustainability/Pillars';
import PullQuote from '@/components/sustainability/PullQuote';
import HowItWorks from '@/components/sustainability/HowItWorks';
import FooterCTA from '@/components/sustainability/FooterCTA';

export default function SustainabilityPage() {
  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <Pillars />
      <PullQuote />
      <HowItWorks />
      <FooterCTA />
    </div>
  );
}
