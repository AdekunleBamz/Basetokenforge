/**
 * SEO and metadata configuration
 */

interface MetadataConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  twitterHandle: string;
  siteUrl: string;
}

export const siteMetadata: MetadataConfig = {
  title: 'Base Token Forge - Create ERC-20 Tokens on Base',
  description:
    'The easiest way to create and deploy ERC-20 tokens on Base. No coding required. Launch your token in minutes with our simple, secure token factory.',
  keywords: [
    'token creator',
    'ERC-20',
    'Base',
    'blockchain',
    'cryptocurrency',
    'token factory',
    'deploy token',
    'create token',
    'Base network',
    'Ethereum L2',
  ],
  ogImage: '/og-image.png',
  twitterHandle: '@BaseTokenForge',
  siteUrl: 'https://basetokenforge.com',
};

/**
 * Generate page metadata
 */
export function generatePageMetadata(
  title?: string,
  description?: string
): { title: string; description: string } {
  return {
    title: title ? `${title} | ${siteMetadata.title}` : siteMetadata.title,
    description: description || siteMetadata.description,
  };
}

/**
 * Generate Open Graph metadata
 */
export function generateOGMetadata(
  title?: string,
  description?: string,
  image?: string
) {
  return {
    title: title || siteMetadata.title,
    description: description || siteMetadata.description,
    images: [
      {
        url: image || siteMetadata.ogImage,
        width: 1200,
        height: 630,
        alt: siteMetadata.title,
      },
    ],
    siteName: 'Base Token Forge',
    type: 'website',
  };
}

/**
 * Generate Twitter metadata
 */
export function generateTwitterMetadata(
  title?: string,
  description?: string,
  image?: string
) {
  return {
    card: 'summary_large_image',
    title: title || siteMetadata.title,
    description: description || siteMetadata.description,
    site: siteMetadata.twitterHandle,
    creator: siteMetadata.twitterHandle,
    images: [image || siteMetadata.ogImage],
  };
}

/**
 * Generate JSON-LD structured data for the main application
 */
export function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Base Token Forge',
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    applicationCategory: 'DeFi Application',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0.00005',
      priceCurrency: 'ETH',
      description: 'Token creation fee on Base network',
    },
    featureList: [
      'Create ERC-20 tokens instantly',
      'Deploy to Base mainnet',
      'No coding required',
      'Low gas fees (~$0.01)',
      'Full token ownership',
      'Verified smart contracts',
    ],
    screenshot: `${siteMetadata.siteUrl}/screenshot.png`,
    softwareVersion: '2.0.0',
  };
}

/**
 * Generate JSON-LD for Organization schema
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Base Token Forge',
    url: siteMetadata.siteUrl,
    logo: `${siteMetadata.siteUrl}/logo.png`,
    description: siteMetadata.description,
    sameAs: [
      'https://twitter.com/BaseTokenForge',
      'https://github.com/basetokenforge',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${siteMetadata.siteUrl}/support`,
    },
  };
}

/**
 * Generate JSON-LD for FAQ schema (helps with rich snippets)
 */
export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD for HowTo schema (token creation guide)
 */
export function generateHowToJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create an ERC-20 Token on Base',
    description: 'Step-by-step guide to creating your own cryptocurrency token on Base network',
    totalTime: 'PT2M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'ETH',
      value: '0.00005',
    },
    step: [
      {
        '@type': 'HowToStep',
        name: 'Connect Wallet',
        text: 'Connect your MetaMask or compatible wallet to Base network',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Enter Token Details',
        text: 'Provide your token name, symbol, and total supply',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Review and Deploy',
        text: 'Review your token configuration and confirm the transaction',
        position: 3,
      },
      {
        '@type': 'HowToStep',
        name: 'Receive Tokens',
        text: 'Your tokens are minted and sent directly to your wallet',
        position: 4,
      },
    ],
  };
}

