import WalletProvider from '@/components/sustainability/WalletProvider';

// Server Component (no 'use client') so this route-segment config actually
// takes effect. Forced dynamic because this page depends on a per-request
// ?email= param and live client-side Privy auth state — there's no valid
// static form of a per-user login screen. Deliberately imports only the
// client wrapper below, never @privy-io/react-auth itself (see
// WalletProvider.js for why that import can't live in a server-evaluated
// file at all).
export const dynamic = 'force-dynamic';

export default function WalletPage() {
  return <WalletProvider />;
}
