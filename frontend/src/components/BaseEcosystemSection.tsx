/**
 * Base Ecosystem Section Component
 * 
 * Highlights the Base L2 ecosystem and its benefits.
 */

"use client";

import { BASE_NETWORK_INFO } from "@/lib/constants";

const ECOSYSTEM_ITEMS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Lightning Fast",
    description: "2-second block times with instant transaction finality on Base L2.",
    stat: "2s blocks",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Ultra Low Fees",
    description: "Transaction fees under $0.01, making token creation accessible to everyone.",
    stat: "<$0.01",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Ethereum Security",
    description: "Inherits security from Ethereum L1 while offering L2 scalability.",
    stat: "ETH Secured",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Global Ecosystem",
    description: "Part of the Coinbase ecosystem with millions of users worldwide.",
    stat: "Millions of users",
  },
];

const ECOSYSTEM_LINKS = [
  { name: "Base Bridge", url: BASE_NETWORK_INFO.bridge, description: "Bridge assets to Base" },
  { name: "Basescan", url: "https://basescan.org", description: "Block explorer" },
  { name: "Base Docs", url: BASE_NETWORK_INFO.docs, description: "Developer documentation" },
  { name: "Aerodrome", url: "https://aerodrome.finance", description: "Leading DEX on Base" },
];

export function BaseEcosystemSection() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-base-blue/20 rounded-full text-base-blue text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-base-blue animate-pulse" />
            Built on Base
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Power of Base L2
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Create tokens on the most developer-friendly Ethereum L2, backed by Coinbase 
            with industry-leading security and performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {ECOSYSTEM_ITEMS.map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-base-blue/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-base-blue/20 text-base-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="text-2xl font-bold text-base-blue mb-1">
                {item.stat}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-white/60 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Ecosystem Links */}
        <div className="p-6 bg-gradient-to-br from-base-blue/10 to-transparent border border-base-blue/30 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">
            Explore the Base Ecosystem
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ECOSYSTEM_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
              >
                <div className="flex-1">
                  <p className="text-white font-medium group-hover:text-base-blue transition-colors">
                    {link.name}
                  </p>
                  <p className="text-white/50 text-sm">{link.description}</p>
                </div>
                <svg
                  className="w-5 h-5 text-white/40 group-hover:text-base-blue transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
