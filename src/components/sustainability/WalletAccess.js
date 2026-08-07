'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePrivy, useLogin } from '@privy-io/react-auth';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, TokenAccountNotFoundError } from '@solana/spl-token';

// Same mint + mainnet-beta fallback src/lib/payout.js uses server-side
// (USDC_MINT_ADDRESS / SOLANA_RPC_URL aren't set in this project's env,
// so both sides are already relying on these exact defaults).
const USDC_MINT = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// Mirrors findEmbeddedWalletForChain in src/lib/payout.js — same filter
// (chain type + Privy-managed), just camelCase field names on the client SDK
// vs. snake_case on the server SDK.
function findSolanaWallet(user) {
  return user?.linkedAccounts?.find(
    (a) => a.type === 'wallet' && a.chainType === 'solana' && a.walletClientType === 'privy'
  );
}

async function fetchUsdcBalance(address) {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta'), 'confirmed');
  const ata = await getAssociatedTokenAddress(USDC_MINT, new PublicKey(address));
  try {
    const account = await getAccount(connection, ata);
    return Number(account.amount) / 10 ** 6;
  } catch (err) {
    if (err instanceof TokenAccountNotFoundError) return 0;
    throw err;
  }
}

const wrap    = { minHeight: '100vh', backgroundColor: '#cac9d1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const card    = { backgroundColor: '#ffffff', border: '2px solid #6c3794', borderRadius: '4px', padding: '40px 36px', width: '100%', maxWidth: '440px', textAlign: 'center', boxSizing: 'border-box' };
const label   = { fontSize: '11px', color: '#2e7d32', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 };
const heading = { fontSize: '24px', fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, color: '#6c3794', marginBottom: '18px' };
const body    = { fontSize: '12px', color: '#5f5e5a', lineHeight: '1.7', marginBottom: '24px' };
const btn     = { width: '100%', padding: '14px', backgroundColor: '#6c3794', border: 'none', borderRadius: '4px', color: '#ffffff', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' };
const mono    = { fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#2c2c2a', wordBreak: 'break-all', backgroundColor: '#f5f4f8', border: '1px solid rgba(108,55,148,0.25)', borderRadius: '4px', padding: '12px 16px', marginBottom: '18px' };

// Participants already have a Privy embedded Solana wallet pregenerated
// server-side (pregenerateWalletForEmail in src/lib/payout.js) at claim
// time — this page is purely the missing client-side entry point for them
// to log into that same account (by email OTP) and see it.
export default function WalletAccess() {
  const prefillEmail = useSearchParams().get('email') || '';
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const [balance, setBalance] = useState(null);
  const [balanceError, setBalanceError] = useState('');

  const wallet = findSolanaWallet(user);

  useEffect(() => {
    if (!wallet?.address) return;
    fetchUsdcBalance(wallet.address)
      .then(setBalance)
      .catch((err) => { console.error('balance fetch failed:', err); setBalanceError('Could not load balance.'); });
  }, [wallet?.address]);

  function handleLogin() {
    login({ loginMethods: ['email'], disableSignup: true, ...(prefillEmail ? { prefill: { type: 'email', value: prefillEmail } } : {}) });
  }

  if (!ready) return null;

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={label}>Reclaim Protocol</div>
        <div style={heading}>{authenticated ? 'Your Wallet' : 'Access Your Wallet'}</div>

        {!authenticated ? (
          <>
            <p style={body}>Log in with the email your payout was sent to, to access your wallet and see your USDC balance.</p>
            <button onClick={handleLogin} style={btn}>→ Log In</button>
          </>
        ) : wallet ? (
          <>
            <p style={{ ...body, marginBottom: '8px' }}>Wallet address</p>
            <div style={mono}>{wallet.address}</div>
            <p style={{ ...body, marginBottom: '8px' }}>USDC balance</p>
            {balanceError
              ? <p style={{ fontSize: '11px', color: '#A32D2D' }}>{balanceError}</p>
              : <div style={{ ...heading, marginBottom: 0 }}>{balance === null ? '…' : `$${balance.toFixed(2)}`}</div>}
          </>
        ) : (
          <p style={body}>No wallet found for this account yet — it may still be provisioning.</p>
        )}
      </div>
    </div>
  );
}
