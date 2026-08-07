'use client';
import { Suspense } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import WalletAccess from './WalletAccess';

// Must be a client component — @privy-io/react-auth isn't safe to import
// into code Next.js evaluates for the server (breaks with a createContext
// TypeError during server page-data collection if imported directly from a
// Server Component file, even one that never actually renders server-side
// due to force-dynamic). page.js stays a pure Server Component that only
// ever imports this wrapper, never Privy itself, so its module graph is
// never touched by anything but the browser bundle.
export default function WalletProvider() {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{ loginMethods: ['email'], embeddedWallets: { solana: { createOnLogin: 'off' } } }}
    >
      <Suspense fallback={null}>
        <WalletAccess />
      </Suspense>
    </PrivyProvider>
  );
}
