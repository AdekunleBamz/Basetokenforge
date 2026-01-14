"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Accordion } from '@/components/ui/Accordion';

const faqItems = [
  {
    id: 'what-is-token-forge',
    title: 'What is Token Forge?',
    content: (
      <p>
        Token Forge is a no-code platform for creating ERC20 tokens on the Base blockchain.
        You can deploy your own token in seconds without any programming knowledge.
        Just connect your wallet, fill in the token details, and click create!
      </p>
    ),
  },
  {
    id: 'what-is-base',
    title: 'What is Base?',
    content: (
      <p>
        Base is a secure, low-cost, and developer-friendly Ethereum L2 (Layer 2) blockchain
        built by Coinbase. It offers fast transactions with significantly lower gas fees
        compared to Ethereum mainnet while maintaining the security of the Ethereum network.
      </p>
    ),
  },
  {
    id: 'how-much-cost',
    title: 'How much does it cost to create a token?',
    content: (
      <div className="space-y-2">
        <p>
          There are two costs associated with creating a token:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Gas fee:</strong> Usually less than $0.01 on Base</li>
          <li><strong>Creation fee:</strong> A small platform fee (displayed at checkout)</li>
        </ul>
        <p>
          The total cost is significantly lower than deploying on Ethereum mainnet!
        </p>
      </div>
    ),
  },
  {
    id: 'token-ownership',
    title: 'Who owns the tokens after creation?',
    content: (
      <p>
        100% of the token supply is sent directly to your connected wallet address.
        You have full ownership and control over your tokens. There are no hidden
        allocations or team tokens - everything goes to you.
      </p>
    ),
  },
  {
    id: 'can-modify-token',
    title: 'Can I modify my token after creation?',
    content: (
      <p>
        No, tokens created through Token Forge are immutable. Once deployed, the token
        name, symbol, decimals, and total supply cannot be changed. This is by design
        to ensure transparency and trustworthiness. Make sure to double-check all
        details before creating your token!
      </p>
    ),
  },
  {
    id: 'token-verified',
    title: 'Will my token be verified on Basescan?',
    content: (
      <p>
        Yes! All tokens created through Token Forge use a verified contract on Basescan.
        This means anyone can view the source code and verify that your token follows
        the standard ERC20 implementation with no hidden functionality.
      </p>
    ),
  },
  {
    id: 'wallets-supported',
    title: 'Which wallets are supported?',
    content: (
      <div className="space-y-2">
        <p>
          Token Forge supports most popular Ethereum wallets including:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>MetaMask</li>
          <li>Coinbase Wallet</li>
          <li>WalletConnect compatible wallets</li>
          <li>Farcaster wallet (in frames)</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'list-exchange',
    title: 'Can I list my token on an exchange?',
    content: (
      <p>
        Tokens created through Token Forge are standard ERC20 tokens and can potentially
        be listed on decentralized exchanges (DEXs) like Uniswap or centralized exchanges.
        However, listing requirements vary by exchange, and Token Forge does not guarantee
        or facilitate any listings.
      </p>
    ),
  },
];

interface FAQSectionProps {
  className?: string;
}

export function FAQSection({ className }: FAQSectionProps) {
  return (
    <section id="faq" className={cn('py-24 px-6', className)}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/60 text-lg">
            Everything you need to know about creating tokens on Base
          </p>
        </div>

        <Accordion items={faqItems} type="single" defaultOpen={['what-is-token-forge']} />
      </div>
    </section>
  );
}
