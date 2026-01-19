/**
 * Base Ecosystem Partners Component
 * 
 * Showcases key projects and partners in the Base ecosystem.
 */

"use client";

const ECOSYSTEM_PARTNERS = [
  {
    name: "Coinbase",
    description: "The exchange behind Base",
    category: "Infrastructure",
    url: "https://www.coinbase.com/",
    logo: "🔷",
  },
  {
    name: "Uniswap",
    description: "Leading DEX on Base",
    category: "DeFi",
    url: "https://app.uniswap.org/",
    logo: "🦄",
  },
  {
    name: "Aerodrome",
    description: "Native Base DEX",
    category: "DeFi",
    url: "https://aerodrome.finance/",
    logo: "✈️",
  },
  {
    name: "OpenSea",
    description: "NFT marketplace",
    category: "NFT",
    url: "https://opensea.io/",
    logo: "🌊",
  },
  {
    name: "Farcaster",
    description: "Decentralized social",
    category: "Social",
    url: "https://warpcast.com/",
    logo: "📣",
  },
  {
    name: "Friend.tech",
    description: "Social token platform",
    category: "Social",
    url: "https://www.friend.tech/",
    logo: "👥",
  },
];

interface EcosystemPartnersProps {
  className?: string;
  limit?: number;
}

export function EcosystemPartners({ className = '', limit }: EcosystemPartnersProps) {
  const partners = limit ? ECOSYSTEM_PARTNERS.slice(0, limit) : ECOSYSTEM_PARTNERS;

  return (
    <section className={`py-12 ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Part of the Base Ecosystem
        </h3>
        <p className="text-white/60">
          Join the growing community of builders on Base
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:border-base-blue/50 hover:bg-base-blue/5 transition-all text-center"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {partner.logo}
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">
              {partner.name}
            </h4>
            <p className="text-xs text-white/50">
              {partner.description}
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-white/5 rounded-full text-white/40">
              {partner.category}
            </span>
          </a>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href="https://base.org/ecosystem"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base-blue hover:text-base-blue/80 transition-colors"
        >
          Explore the full ecosystem
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </section>
  );
}

/**
 * Compact partner logos strip
 */
export function PartnerLogosStrip() {
  return (
    <div className="flex items-center justify-center gap-8 py-6 flex-wrap opacity-60">
      {ECOSYSTEM_PARTNERS.slice(0, 5).map((partner) => (
        <span key={partner.name} className="text-2xl" title={partner.name}>
          {partner.logo}
        </span>
      ))}
    </div>
  );
}

/**
 * Ecosystem categories
 */
export function EcosystemCategories() {
  const categories = [
    { name: "DeFi", count: 50, icon: "💰" },
    { name: "NFT", count: 30, icon: "🖼️" },
    { name: "Gaming", count: 25, icon: "🎮" },
    { name: "Social", count: 20, icon: "💬" },
    { name: "Infrastructure", count: 15, icon: "🏗️" },
    { name: "DAO", count: 10, icon: "🏛️" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {categories.map((category) => (
        <div
          key={category.name}
          className="p-4 bg-white/5 rounded-xl text-center border border-white/10"
        >
          <span className="text-2xl mb-2 block">{category.icon}</span>
          <h4 className="font-medium text-white text-sm">{category.name}</h4>
          <p className="text-xs text-white/50 mt-1">{category.count}+ projects</p>
        </div>
      ))}
    </div>
  );
}
