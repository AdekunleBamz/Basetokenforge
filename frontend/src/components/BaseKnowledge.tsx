/**
 * Base Knowledge Card Component
 * 
 * Educational cards about Base L2 network concepts.
 */

"use client";

import { useState } from "react";

interface KnowledgeCard {
  id: string;
  title: string;
  summary: string;
  details: string;
  icon: string;
  learnMoreUrl?: string;
}

const BASE_KNOWLEDGE: KnowledgeCard[] = [
  {
    id: 'what-is-base',
    title: "What is Base?",
    summary: "Base is a secure, low-cost, developer-friendly Ethereum L2.",
    details: "Base is built on Optimism's OP Stack and is incubated by Coinbase. It offers low transaction costs, fast confirmations, and full EVM compatibility while inheriting Ethereum's security.",
    icon: "🔵",
    learnMoreUrl: "https://base.org",
  },
  {
    id: 'gas-fees',
    title: "Why are fees so low?",
    summary: "Base uses optimistic rollups to batch transactions.",
    details: "Transactions are batched together and processed off-chain, with proofs submitted to Ethereum. This results in fees that are typically 10-100x lower than Ethereum mainnet.",
    icon: "⛽",
    learnMoreUrl: "https://docs.base.org/",
  },
  {
    id: 'bridging',
    title: "How do I bridge to Base?",
    summary: "Use the official Base Bridge to move ETH from Ethereum.",
    details: "The Base Bridge allows you to securely transfer ETH from Ethereum mainnet to Base. Bridging typically takes about 10 minutes, and withdrawals back to L1 have a 7-day challenge period.",
    icon: "🌉",
    learnMoreUrl: "https://bridge.base.org",
  },
  {
    id: 'security',
    title: "Is Base secure?",
    summary: "Base inherits Ethereum's security as an L2 rollup.",
    details: "Base posts transaction data to Ethereum and uses fraud proofs to ensure correctness. Your assets are secured by Ethereum's validator network, making Base as secure as Ethereum itself.",
    icon: "🔒",
    learnMoreUrl: "https://docs.base.org/security/",
  },
  {
    id: 'erc20-tokens',
    title: "What are ERC-20 tokens?",
    summary: "A standard for creating fungible tokens on Ethereum.",
    details: "ERC-20 is the most widely used token standard. It defines a common interface that allows tokens to be transferred, approved, and interact with other smart contracts in a predictable way.",
    icon: "🪙",
    learnMoreUrl: "https://ethereum.org/en/developers/docs/standards/tokens/erc-20/",
  },
  {
    id: 'smart-contracts',
    title: "What are smart contracts?",
    summary: "Self-executing programs that run on the blockchain.",
    details: "Smart contracts are code that automatically executes when conditions are met. They power token creation, DeFi protocols, NFTs, and more. Once deployed, they cannot be changed.",
    icon: "📜",
    learnMoreUrl: "https://ethereum.org/en/smart-contracts/",
  },
];

interface BaseKnowledgeCardProps {
  cardId?: string;
  className?: string;
}

export function BaseKnowledgeCard({ cardId, className = '' }: BaseKnowledgeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const card = cardId 
    ? BASE_KNOWLEDGE.find(k => k.id === cardId) 
    : BASE_KNOWLEDGE[Math.floor(Math.random() * BASE_KNOWLEDGE.length)];

  if (!card) return null;

  return (
    <div className={`bg-gradient-to-br from-base-blue/10 to-purple-500/5 border border-base-blue/20 rounded-xl overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        <span className="text-2xl">{card.icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{card.title}</h4>
          <p className="text-sm text-white/60 mt-0.5">{card.summary}</p>
        </div>
        <svg
          className={`w-5 h-5 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/10 mt-2">
          <p className="text-sm text-white/70 leading-relaxed">
            {card.details}
          </p>
          {card.learnMoreUrl && (
            <a
              href={card.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-base-blue hover:text-base-blue/80 text-sm"
            >
              Learn more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Knowledge section with multiple cards
 */
export function BaseKnowledgeSection({ className = '' }: { className?: string }) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Learn About Base</h3>
        <p className="text-white/60">Everything you need to know about the Base network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BASE_KNOWLEDGE.map(card => (
          <BaseKnowledgeCard key={card.id} cardId={card.id} />
        ))}
      </div>
    </section>
  );
}

/**
 * Random tip component
 */
export function RandomBaseTip() {
  const tip = BASE_KNOWLEDGE[Math.floor(Math.random() * BASE_KNOWLEDGE.length)];

  return (
    <div className="p-4 bg-base-blue/10 border border-base-blue/20 rounded-xl">
      <div className="flex items-start gap-3">
        <span className="text-xl">{tip.icon}</span>
        <div>
          <p className="text-xs text-base-blue font-medium mb-1">Did you know?</p>
          <p className="text-sm text-white/80">{tip.summary}</p>
        </div>
      </div>
    </div>
  );
}
