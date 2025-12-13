"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useReadContract, useReadContracts } from "wagmi";
import { TOKEN_FACTORY_ABI, ERC20_ABI } from "@/config/abi";
import { TOKEN_FACTORY_ADDRESS } from "@/config/wagmi";
import { formatUnits } from "viem";

interface TokenInfo {
  address: `0x${string}`;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: bigint;
}

export function MyTokens() {
  const { address, isConnected } = useAppKitAccount();

  // Get user's tokens from factory
  const { data: tokenAddresses, isLoading } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TOKEN_FACTORY_ABI,
    functionName: "getTokensByCreator",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get token details for each token
  const tokenContracts = (tokenAddresses || []).flatMap((addr) => [
    { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: "name" },
    { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: "symbol" },
    { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: "decimals" },
    { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: "totalSupply" },
  ]);

  const { data: tokenDetails } = useReadContracts({
    contracts: tokenContracts,
    query: {
      enabled: tokenAddresses && tokenAddresses.length > 0,
    },
  });

  // Parse token info
  const tokens: TokenInfo[] = (tokenAddresses || []).map((addr, i) => {
    const baseIdx = i * 4;
    return {
      address: addr as `0x${string}`,
      name: tokenDetails?.[baseIdx]?.result as string | undefined,
      symbol: tokenDetails?.[baseIdx + 1]?.result as string | undefined,
      decimals: tokenDetails?.[baseIdx + 2]?.result as number | undefined,
      totalSupply: tokenDetails?.[baseIdx + 3]?.result as bigint | undefined,
    };
  });

  if (!isConnected) {
    return (
      <section id="tokens" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            My Tokens
          </h2>
          <p className="text-white/60">Connect your wallet to see your tokens</p>
        </div>
      </section>
    );
  }

  return (
    <section id="tokens" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            My Tokens
          </h2>
          <p className="text-white/60 text-lg">
            Tokens you&apos;ve created on Base
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="spinner" />
          </div>
        ) : tokens.length === 0 ? (
          <div className="card-forge text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No tokens yet
            </h3>
            <p className="text-white/60 mb-6">
              Create your first token to see it here
            </p>
            <a href="#create" className="btn-forge inline-block">
              Create Token
            </a>
          </div>
        ) : (
          <div className="grid gap-4">
            {tokens.map((token, idx) => (
              <TokenCard key={token.address || idx} token={token} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TokenCard({ token }: { token: TokenInfo }) {
  const formattedSupply = token.totalSupply && token.decimals !== undefined
    ? formatUnits(token.totalSupply, token.decimals)
    : "...";

  return (
    <div className="card-forge flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Token Icon */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center font-bold text-lg text-base-dark shrink-0">
        {token.symbol?.charAt(0) || "?"}
      </div>

      {/* Token Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-lg text-white truncate">
          {token.name || "Loading..."}
        </h3>
        <p className="text-white/60 text-sm">
          {token.symbol || "..."} •{" "}
          {Number(formattedSupply).toLocaleString()} supply
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <a
          href={`https://basescan.org/token/${token.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-sm font-medium transition-colors text-center"
        >
          Basescan
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(token.address);
          }}
          className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          Copy Address
        </button>
      </div>
    </div>
  );
}
