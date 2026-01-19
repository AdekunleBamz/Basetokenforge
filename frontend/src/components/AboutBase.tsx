/**
 * Base Chain About Section
 * 
 * Educational content about Base L2 and why it's great for tokens.
 */

"use client";

import { BASE_MAINNET, BASE_NETWORK_STATS } from "@/lib/base-chain";

export function AboutBase() {
  return (
    <section className="py-20 px-6" id="about-base">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Why Deploy on{" "}
            <span className="text-base-blue">Base</span>?
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Base is an Ethereum L2 built by Coinbase, offering the security of Ethereum 
            with significantly lower costs and faster transactions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Ultra-Low Fees"
            description="Gas costs are typically 100x cheaper than Ethereum mainnet. Deploy tokens for just cents."
          />

          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Lightning Fast"
            description={`${BASE_NETWORK_STATS.avgBlockTime} second block times mean your token is live almost instantly.`}
          />

          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Ethereum Security"
            description="Base inherits Ethereum's world-class security. Your tokens are protected by billions in stake."
          />

          <FeatureCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Growing Ecosystem"
            description="Join thousands of projects already building on Base. Access DeFi, NFTs, and more."
          />
        </div>

        {/* Stats */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem
              value={BASE_MAINNET.id.toString()}
              label="Chain ID"
            />
            <StatItem
              value={`~${BASE_NETWORK_STATS.avgBlockTime}s`}
              label="Block Time"
            />
            <StatItem
              value={BASE_NETWORK_STATS.tps.toLocaleString()}
              label="TPS Capacity"
            />
            <StatItem
              value="99.9%"
              label="Uptime"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-base-blue hover:text-base-blue/80 transition-colors"
          >
            Learn more about Base
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-base-blue/30 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-base-blue/20 flex items-center justify-center text-base-blue mb-4">
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  );
}

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="font-display font-bold text-2xl md:text-3xl text-white mb-1">
        {value}
      </div>
      <div className="text-white/50 text-sm">{label}</div>
    </div>
  );
}
