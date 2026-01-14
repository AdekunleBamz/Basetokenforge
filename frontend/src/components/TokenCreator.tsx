"use client";

import { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, parseUnits, formatEther, createWalletClient, custom } from "viem";
import { base } from "viem/chains";
import { TOKEN_FACTORY_ABI } from "@/config/abi";
import { TOKEN_FACTORY_ADDRESS, CREATION_FEE } from "@/config/wagmi";
import { useFarcaster } from "@/hooks/useFarcaster";
import { sdk } from "@farcaster/frame-sdk";
import { NumberInput } from "@/components/NumberInput";

interface TokenForm {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}

export function TokenCreator() {
  const { address: appKitAddress, isConnected: isAppKitConnected } = useAppKitAccount();
  const { isInFrame } = useFarcaster();
  
  const [farcasterAddress, setFarcasterAddress] = useState<string | null>(null);
  const [form, setForm] = useState<TokenForm>({
    name: "",
    symbol: "",
    decimals: 18,
    supply: "1000000",
  });
  const [fcTxHash, setFcTxHash] = useState<string | null>(null);
  const [fcIsPending, setFcIsPending] = useState(false);
  const [fcError, setFcError] = useState<string | null>(null);

  // Get Farcaster address
  useEffect(() => {
    if (isInFrame) {
      sdk.wallet.ethProvider.request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            setFarcasterAddress(accounts[0] as string);
          }
        })
        .catch(console.error);
    }
  }, [isInFrame]);

  const isConnected = isInFrame ? !!farcasterAddress : isAppKitConnected;
  const address = isInFrame ? farcasterAddress : appKitAddress;

  // Read current fee from contract
  const { data: currentFee } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TOKEN_FACTORY_ABI,
    functionName: "creationFee",
  });

  const fee = currentFee ? formatEther(currentFee) : CREATION_FEE;

  // Wagmi write contract hook (for non-Farcaster)
  const { data: hash, isPending, writeContract, error } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: hash || (fcTxHash as `0x${string}` | undefined),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;

    const supplyWithDecimals = parseUnits(form.supply, form.decimals);

    if (isInFrame && farcasterAddress) {
      // Use Farcaster wallet
      setFcIsPending(true);
      setFcError(null);
      setFcTxHash(null);

      try {
        // Create transaction data
        const walletClient = createWalletClient({
          chain: base,
          transport: custom(sdk.wallet.ethProvider),
        });

        const txHash = await walletClient.writeContract({
          address: TOKEN_FACTORY_ADDRESS,
          abi: TOKEN_FACTORY_ABI,
          functionName: "createToken",
          args: [form.name, form.symbol, form.decimals, supplyWithDecimals],
          value: parseEther(fee),
          account: farcasterAddress as `0x${string}`,
        });

        setFcTxHash(txHash);
      } catch (err) {
        console.error("Farcaster tx error:", err);
        setFcError(err instanceof Error ? err.message : "Transaction failed");
      } finally {
        setFcIsPending(false);
      }
    } else {
      // Use wagmi/AppKit
      writeContract({
        address: TOKEN_FACTORY_ADDRESS,
        abi: TOKEN_FACTORY_ABI,
        functionName: "createToken",
        args: [form.name, form.symbol, form.decimals, supplyWithDecimals],
        value: parseEther(fee),
      });
    }
  };

  const isValidForm =
    form.name.length > 0 &&
    form.symbol.length > 0 &&
    form.symbol.length <= 11 &&
    parseFloat(form.supply) > 0;

  const txPending = isInFrame ? fcIsPending : isPending;
  const txError = isInFrame ? fcError : error?.message;
  const txHash = isInFrame ? fcTxHash : hash;
  const txSuccess = isSuccess && !!txHash;

  return (
    <section id="create" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Create Your Token
          </h2>
          <p className="text-white/60 text-lg">
            Fill in the details below to deploy your ERC20 token on Base
          </p>
        </div>

        {/* Form Card */}
        <div className="card-forge">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Token Name */}
            <div>
              <label className="block text-white/80 font-medium mb-2">
                Token Name
              </label>
              <input
                type="text"
                placeholder="e.g., My Awesome Token"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-forge"
                maxLength={64}
              />
            </div>

            {/* Token Symbol */}
            <div>
              <label className="block text-white/80 font-medium mb-2">
                Token Symbol
              </label>
              <input
                type="text"
                placeholder="e.g., MAT"
                value={form.symbol}
                onChange={(e) =>
                  setForm({ ...form, symbol: e.target.value.toUpperCase() })
                }
                className="input-forge"
                maxLength={11}
              />
              <p className="text-white/40 text-sm mt-1">
                Max 11 characters, uppercase recommended
              </p>
            </div>

            {/* Decimals */}
            <div>
              <label className="block text-white/80 font-medium mb-2">
                Decimals
              </label>
              <select
                value={form.decimals}
                onChange={(e) =>
                  setForm({ ...form, decimals: parseInt(e.target.value) })
                }
                className="input-forge cursor-pointer"
              >
                <option value={18}>18 (Standard)</option>
                <option value={8}>8 (Like BTC)</option>
                <option value={6}>6 (Like USDC)</option>
                <option value={0}>0 (No decimals)</option>
              </select>
            </div>

            {/* Total Supply */}
            <div>
              <NumberInput
                label="Total Supply"
                placeholder="1000000"
                value={form.supply}
                onValueChange={(supply) => setForm({ ...form, supply })}
                min={1}
                step={1}
                allowDecimals={false}
                hint="All tokens will be minted to your wallet"
              />
            </div>

            {/* Fee Display */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-forge-orange/10 border border-forge-orange/30">
              <span className="text-white/80">Creation Fee</span>
              <span className="font-display font-bold text-forge-orange">
                {fee} ETH
              </span>
            </div>

            {/* Preview */}
            {form.name && form.symbol && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-sm mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center font-bold text-base-dark">
                    {form.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{form.name}</p>
                    <p className="text-white/60 text-sm">
                      {form.symbol} • {Number(form.supply).toLocaleString()} supply
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {txError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm">
                  {txError.includes("User rejected") || txError.includes("rejected")
                    ? "Transaction cancelled"
                    : txError.slice(0, 100)}
                </p>
              </div>
            )}

            {/* Success Display */}
            {txSuccess && txHash && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-green-400 font-medium mb-2">
                  🎉 Token Created Successfully!
                </p>
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400/80 text-sm underline hover:text-green-400"
                >
                  View on Basescan →
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isConnected || !isValidForm || txPending || isConfirming}
              className="btn-forge w-full flex items-center justify-center gap-3"
            >
              {txPending || isConfirming ? (
                <>
                  <div className="spinner" />
                  <span>{txPending ? "Confirm in Wallet..." : "Deploying..."}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span>Forge Token</span>
                </>
              )}
            </button>

            {!isConnected && (
              <p className="text-center text-white/50 text-sm">
                Connect your wallet to create a token
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
