"use client";

import { useEffect, useRef, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, parseUnits, formatEther, createWalletClient, custom } from "viem";
import { base } from "viem/chains";
import { TOKEN_FACTORY_ABI } from "@/config/abi";
import { TOKEN_FACTORY_ADDRESS, CREATION_FEE } from "@/config/wagmi";
import { useFarcaster } from "@/hooks/useFarcaster";
import { sdk } from "@farcaster/frame-sdk";
import { NumberInput } from "@/components/NumberInput";
import { FormField, ValidatedInput } from "@/components/FormField";
import { useFormValidation, validationRules } from "@/hooks/useFormValidation";
import { useToast } from "@/components/ToastNotification";
import { useConfetti } from "@/components/Confetti";

export function TokenCreator() {
  const { address: appKitAddress, isConnected: isAppKitConnected } = useAppKitAccount();
  const { isInFrame } = useFarcaster();
  
  const [farcasterAddress, setFarcasterAddress] = useState<string | null>(null);
  const [decimals, setDecimals] = useState(18);
  const { values, validations, handleChange, handleBlur, validateAll, isFormValid } =
    useFormValidation(
      {
        name: "",
        symbol: "",
        supply: "1000000",
      },
      {
        name: [
          validationRules.required("Token name is required"),
          validationRules.minLength(2, "Token name must be at least 2 characters"),
          validationRules.maxLength(64, "Token name must be 64 characters or less"),
        ],
        symbol: [
          validationRules.required("Token symbol is required"),
          validationRules.maxLength(11, "Token symbol must be 11 characters or less"),
          validationRules.pattern(/^[A-Z0-9]+$/, "Use uppercase letters and numbers only"),
        ],
        supply: [
          validationRules.required("Supply is required"),
          validationRules.positiveNumber("Supply must be a positive number"),
        ],
      }
    );
  const [fcTxHash, setFcTxHash] = useState<string | null>(null);
  const [fcIsPending, setFcIsPending] = useState(false);
  const [fcError, setFcError] = useState<string | null>(null);
  const lastTxHashRef = useRef<string | null>(null);
  const lastErrorRef = useRef<string | null>(null);
  const { success, error: toastError } = useToast();
  const confetti = useConfetti();

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
    if (!validateAll()) return;

    const supplyWithDecimals = parseUnits(values.supply, decimals);

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
          args: [values.name, values.symbol, decimals, supplyWithDecimals],
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
        args: [values.name, values.symbol, decimals, supplyWithDecimals],
        value: parseEther(fee),
      });
    }
  };

  useEffect(() => {
    if (txSuccess && txHash && txHash !== lastTxHashRef.current) {
      lastTxHashRef.current = txHash;
      confetti.trigger();
      success("Token created", "Your token was deployed successfully.");
    }
  }, [txSuccess, txHash, confetti, success]);

  useEffect(() => {
    if (txError && txError !== lastErrorRef.current) {
      lastErrorRef.current = txError;
      toastError("Transaction failed", txError.slice(0, 120));
    }
  }, [txError, toastError]);

  const txPending = isInFrame ? fcIsPending : isPending;
  const txError = isInFrame ? fcError : error?.message;
  const txHash = isInFrame ? fcTxHash : hash;
  const txSuccess = isSuccess && !!txHash;
  const canSubmit =
    isFormValid &&
    values.name.trim().length > 0 &&
    values.symbol.trim().length > 0 &&
    parseFloat(values.supply) > 0;

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
            <FormField
              label="Token Name"
              required
              touched={validations.name?.touched}
              error={validations.name?.error}
              successMessage="Looks good"
              showSuccess
            >
              <ValidatedInput
                type="text"
                placeholder="e.g., My Awesome Token"
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                maxLength={64}
                hasError={!!validations.name?.error}
                isSuccess={validations.name?.touched && !validations.name?.error}
              />
            </FormField>

            {/* Token Symbol */}
            <FormField
              label="Token Symbol"
              required
              touched={validations.symbol?.touched}
              error={validations.symbol?.error}
              hint="Max 11 characters, uppercase only"
              successMessage="Symbol ready"
              showSuccess
            >
              <ValidatedInput
                type="text"
                placeholder="e.g., MAT"
                value={values.symbol}
                onChange={(e) => handleChange("symbol", e.target.value.toUpperCase())}
                onBlur={() => handleBlur("symbol")}
                maxLength={11}
                hasError={!!validations.symbol?.error}
                isSuccess={validations.symbol?.touched && !validations.symbol?.error}
              />
            </FormField>

            {/* Decimals */}
            <FormField label="Decimals" hint="Standard ERC20 uses 18 decimals">
              <select
                value={decimals}
                onChange={(e) => setDecimals(parseInt(e.target.value))}
                className="input-forge cursor-pointer"
              >
                <option value={18}>18 (Standard)</option>
                <option value={8}>8 (Like BTC)</option>
                <option value={6}>6 (Like USDC)</option>
                <option value={0}>0 (No decimals)</option>
              </select>
            </FormField>

            {/* Total Supply */}
            <FormField
              label="Total Supply"
              required
              touched={validations.supply?.touched}
              error={validations.supply?.error}
              hint="All tokens will be minted to your wallet"
              successMessage="Supply looks valid"
              showSuccess
            >
              <NumberInput
                label=""
                placeholder="1000000"
                value={values.supply}
                onValueChange={(supply) => handleChange("supply", supply)}
                min={1}
                step={1}
                allowDecimals={false}
              />
            </FormField>

            {/* Fee Display */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-forge-orange/10 border border-forge-orange/30">
              <span className="text-white/80">Creation Fee</span>
              <span className="font-display font-bold text-forge-orange">
                {fee} ETH
              </span>
            </div>

            {/* Preview */}
            {values.name && values.symbol && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-sm mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center font-bold text-base-dark">
                    {values.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{values.name}</p>
                    <p className="text-white/60 text-sm">
                      {values.symbol} • {Number(values.supply).toLocaleString()} supply
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
              disabled={!isConnected || !canSubmit || txPending || isConfirming}
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
      <confetti.Confetti duration={3500} particleCount={140} />
    </section>
  );
}
