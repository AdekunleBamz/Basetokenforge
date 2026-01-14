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
 * Generate JSON-LD structured data
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
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
