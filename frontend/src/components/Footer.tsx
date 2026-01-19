"use client";

import { BASE_MAINNET } from "@/lib/base-chain";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-base-dark"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-display font-bold text-white text-lg">
                Base Token Forge
              </span>
            </div>
            <p className="text-white/50 text-sm mb-4">
              Deploy ERC20 tokens on Base in seconds. No code required, ultra-low fees.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-400 text-xs">Live on Base Mainnet</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#create" className="text-white/60 hover:text-white text-sm transition-colors">
                  Create Token
                </a>
              </li>
              <li>
                <a href="#tokens" className="text-white/60 hover:text-white text-sm transition-colors">
                  My Tokens
                </a>
              </li>
              <li>
                <a href="#faq" className="text-white/60 hover:text-white text-sm transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#about-base" className="text-white/60 hover:text-white text-sm transition-colors">
                  Why Base?
                </a>
              </li>
            </ul>
          </div>

          {/* Base Ecosystem */}
          <div>
            <h4 className="text-white font-semibold mb-4">Base Ecosystem</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://base.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  Base.org
                  <ExternalIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://basescan.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  Basescan
                  <ExternalIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://bridge.base.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  Base Bridge
                  <ExternalIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://docs.base.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  Documentation
                  <ExternalIcon />
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/AdekunleBamz/Basetokenforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  GitHub
                  <ExternalIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/base"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  Twitter
                  <ExternalIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://warpcast.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  Farcaster
                  <ExternalIcon />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">
            © {currentYear} Base Token Forge. Built with ❤️ on Base.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/40">Chain ID: {BASE_MAINNET.id}</span>
            <span className="text-white/20">|</span>
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-blue hover:text-base-blue/80 transition-colors"
            >
              Powered by Base
            </a>
          </div>
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

function ExternalIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

