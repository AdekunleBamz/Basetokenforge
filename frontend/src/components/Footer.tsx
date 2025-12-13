"use client";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center">
              <svg
                className="w-5 h-5 text-base-dark"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display font-bold text-white">
              Base Token Forge
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              Built on Base
            </a>
            <a
              href="https://basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              Basescan
            </a>
            <a
              href="https://github.com/AdekunleBamz/Basetokenforge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <p className="text-white/40 text-sm">
            © 2025 Base Token Forge
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-white/30 text-xs text-center max-w-2xl mx-auto">
            This tool creates standard ERC20 tokens on Base mainnet. Tokens are
            deployed directly to the blockchain and cannot be modified after
            creation. Always verify contract addresses on Basescan before
            interacting with any token.
          </p>
        </div>
      </div>
    </footer>
  );
}

