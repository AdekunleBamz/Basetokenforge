/**
 * Share Buttons Component
 * 
 * Social sharing buttons for tokens.
 */

"use client";

import { 
  getTwitterShareUrl, 
  getFarcasterShareUrl, 
  getTelegramShareUrl,
  generateTokenShareContent,
  openInNewTab,
} from "@/lib/urls";

interface ShareButtonsProps {
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  chainId?: number;
  className?: string;
  variant?: 'icons' | 'buttons' | 'compact';
}

export function ShareButtons({
  tokenName,
  tokenSymbol,
  tokenAddress,
  chainId,
  className = '',
  variant = 'icons',
}: ShareButtonsProps) {
  const { text, url } = generateTokenShareContent(tokenName, tokenSymbol, tokenAddress, chainId);

  const platforms = [
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      getUrl: () => getTwitterShareUrl(text, url),
      color: 'hover:bg-black hover:text-white',
    },
    {
      name: 'Farcaster',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 4h18v16.5c0 .83-.67 1.5-1.5 1.5h-15C3.67 22 3 21.33 3 20.5V4zm4 3v10h2V7H7zm8 0v10h2V7h-2zm-4 0v4h2V7h-2zm0 6v4h2v-4h-2z" />
        </svg>
      ),
      getUrl: () => getFarcasterShareUrl(`${text}\n${url}`),
      color: 'hover:bg-purple-600 hover:text-white',
    },
    {
      name: 'Telegram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      getUrl: () => getTelegramShareUrl(text, url),
      color: 'hover:bg-blue-500 hover:text-white',
    },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => openInNewTab(platform.getUrl())}
            className={`p-1.5 text-white/40 rounded-lg transition-colors ${platform.color}`}
            title={`Share on ${platform.name}`}
          >
            {platform.icon}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => openInNewTab(platform.getUrl())}
            className={`inline-flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 transition-all ${platform.color}`}
          >
            {platform.icon}
            <span className="text-sm">{platform.name}</span>
          </button>
        ))}
      </div>
    );
  }

  // Default icons variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {platforms.map((platform) => (
        <button
          key={platform.name}
          onClick={() => openInNewTab(platform.getUrl())}
          className={`p-2.5 bg-white/5 text-white/60 rounded-xl border border-white/10 transition-all ${platform.color}`}
          title={`Share on ${platform.name}`}
        >
          {platform.icon}
        </button>
      ))}
    </div>
  );
}

/**
 * Share section with copy link
 */
interface ShareSectionProps extends ShareButtonsProps {
  showCopyLink?: boolean;
}

export function ShareSection({
  showCopyLink = true,
  ...props
}: ShareSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white/80">Share your token</h4>
      </div>
      
      <ShareButtons {...props} variant="buttons" />
      
      {showCopyLink && (
        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
          <input
            type="text"
            readOnly
            value={`${typeof window !== 'undefined' ? window.location.origin : ''}?token=${props.tokenAddress}`}
            className="flex-1 bg-transparent text-white/60 text-sm outline-none"
          />
          <button className="px-3 py-1 bg-base-blue text-white text-sm font-medium rounded-lg hover:bg-base-blue/90 transition-colors">
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
