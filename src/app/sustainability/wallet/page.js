'use client';
import { Suspense } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import WalletAccess from '@/components/sustainability/WalletAccess';

// solana.createOnLogin: 'off' — a wallet is already pregenerated
// server-side for every claim recipient, so the client SDK should never
// try to create a second one here.
export default function WalletPage() {
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
