/**
 * SEO Configuration for Base Token Forge
 * 
 * Optimized metadata for search engines and social sharing.
 */

export const SEO_CONFIG = {
  title: 'Base Token Forge - Deploy ERC20 Tokens on Base',
  description: 'Deploy your own ERC20 tokens on Base L2 in seconds. No code required, ultra-low gas fees, instant deployment. Built on Coinbase\'s Base network.',
  keywords: [
    'Base',
    'Base L2',
    'ERC20',
    'token',
    'token creator',
    'token factory',
    'Coinbase',
    'Ethereum L2',
    'crypto',
    'blockchain',
    'smart contract',
    'no code',
    'token deployment',
    'Base mainnet',
  ],
  url: 'https://basetokenforge.vercel.app',
  image: 'https://basetokenforge.vercel.app/og-image.png',
  twitterHandle: '@basetokenforge',
  locale: 'en_US',
  type: 'website',
} as const;

/**
 * Generate page title with site name
 */
export function getPageTitle(pageTitle?: string): string {
  if (!pageTitle) return SEO_CONFIG.title;
  return `${pageTitle} | Base Token Forge`;
}

/**
 * Open Graph metadata for social sharing
 */
export const OG_CONFIG = {
  type: 'website',
  siteName: 'Base Token Forge',
  images: [
    {
      url: SEO_CONFIG.image,
      width: 1200,
      height: 630,
      alt: 'Base Token Forge - Deploy ERC20 Tokens on Base',
    },
  ],
} as const;

/**
 * Twitter card metadata
 */
export const TWITTER_CONFIG = {
  card: 'summary_large_image' as const,
  site: '@basetokenforge',
  creator: '@basetokenforge',
} as const;

/**
 * Structured data for search engines (JSON-LD)
 */
export function getStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Base Token Forge',
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free to use, only pay gas fees on Base L2',
    },
    featureList: [
      'No code required',
      'Deploy ERC20 tokens',
      'Ultra-low gas fees',
      'Base L2 network',
      'Instant deployment',
      'Full token ownership',
    ],
  };
}

/**
 * Farcaster Frame metadata
 */
export const FRAME_CONFIG = {
  version: 'next',
  image: SEO_CONFIG.image,
  buttons: [
    {
      label: 'Create Token',
      action: 'post',
    },
  ],
  ogImage: SEO_CONFIG.image,
  ogTitle: 'Base Token Forge',
  ogDescription: 'Deploy ERC20 tokens on Base in seconds',
} as const;
