"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, parseUnits, formatEther } from "viem";
import { TOKEN_FACTORY_ABI } from "@/config/abi";
import { TOKEN_FACTORY_ADDRESS, CREATION_FEE } from "@/config/wagmi";

interface TokenForm {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}

export function TokenCreator() {
  const { address, isConnected } = useAccount();
  const [form, setForm] = useState<TokenForm>({
    name: "",
    symbol: "",
    decimals: 18,
    supply: "1000000",
  });
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  // Read current fee from contract
  const { data: currentFee } = useReadContract({
    address: TOKEN_FACTORY_ADDRESS,
    abi: TOKEN_FACTORY_ABI,
    functionName: "creationFee",
  });

  const fee = currentFee ? formatEther(currentFee) : CREATION_FEE;

  // Write contract hook
  const { data: hash, isPending, writeContract, error } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      // In a real app, you'd parse the logs to get the token address
      setCreatedToken("pending");
    }
  }, [isSuccess, hash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;

    const supplyWithDecimals = parseUnits(form.supply, form.decimals);

    writeContract({
      address: TOKEN_FACTORY_ADDRESS,
      abi: TOKEN_FACTORY_ABI,
      functionName: "createToken",
      args: [form.name, form.symbol, form.decimals, supplyWithDecimals],
      value: parseEther(fee),
    });
  };

  const isValidForm =
    form.name.length > 0 &&
    form.symbol.length > 0 &&
    form.symbol.length <= 11 &&
    parseFloat(form.supply) > 0;

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
              <label className="block text-white/80 font-medium mb-2">
                Total Supply
              </label>
              <input
                type="number"
                placeholder="1000000"
                value={form.supply}
                onChange={(e) => setForm({ ...form, supply: e.target.value })}
                className="input-forge"
                min="1"
              />
              <p className="text-white/40 text-sm mt-1">
                All tokens will be minted to your wallet
              </p>
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
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm">
                  {error.message.includes("User rejected")
                    ? "Transaction cancelled"
                    : error.message.slice(0, 100)}
                </p>
              </div>
            )}

            {/* Success Display */}
            {isSuccess && hash && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-green-400 font-medium mb-2">
                  🎉 Token Created Successfully!
                </p>
                <a
                  href={`https://basescan.org/tx/${hash}`}
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
              disabled={!isConnected || !isValidForm || isPending || isConfirming}
              className="btn-forge w-full flex items-center justify-center gap-3"
            >
              {isPending || isConfirming ? (
                <>
                  <div className="spinner" />
                  <span>{isPending ? "Confirm in Wallet..." : "Deploying..."}</span>
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

