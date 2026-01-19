/**
 * How It Works Section Component
 * 
 * Step-by-step guide for creating tokens on Base.
 */

"use client";

const STEPS = [
  {
    number: 1,
    title: "Connect Wallet",
    description: "Connect your wallet to the Base network. We support Coinbase Wallet, MetaMask, and WalletConnect.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Configure Token",
    description: "Set your token name, symbol, decimals, and initial supply. Our wizard guides you through each step.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Review & Deploy",
    description: "Review your token details and confirm the transaction. Your token deploys in seconds on Base.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Share & Trade",
    description: "Get your token address and share it with the world. Add liquidity on Aerodrome or other Base DEXs.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-base-blue/5">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Create your ERC-20 token on Base in minutes. No coding required.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-base-blue/30 to-transparent" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step card */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-base-blue/30 transition-all hover:-translate-y-1">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-6">
                    <div className="w-8 h-8 rounded-full bg-base-blue text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-base-blue/25">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-base-blue/20 to-purple-500/20 text-base-blue flex items-center justify-center mb-4 mt-2">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (hidden on last item and mobile) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg 
                      className="w-8 h-8 text-base-blue/30" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-white/60 mb-4">Ready to create your token?</p>
          <a
            href="#create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-base-blue hover:bg-base-blue/90 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-base-blue/25"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
