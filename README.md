# 🔥 Base Token Forge

Deploy your own ERC20 tokens on **Base mainnet** with one click. No coding required.

![Base Token Forge](./docs/screenshot.png)

## Features

- ⚡ **Instant Deployment** - Create ERC20 tokens in seconds
- 💰 **Low Cost** - Base's low gas fees mean deployment costs ~$0.01
- 🎨 **Beautiful UI** - Modern, forge-themed dark interface
- 🔗 **On-chain** - 100% on-chain, fully decentralized
- 📱 **Farcaster Ready** - Works as a Farcaster Mini App
- 🔒 **Secure** - Standard OpenZeppelin ERC20 implementation

## Getting Started

### Prerequisites

- Node.js 18+
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for contracts)
- A wallet with ETH on Base mainnet

### Contract Deployment

1. Install Foundry dependencies:
```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install foundry-rs/forge-std --no-commit
```

2. Create `.env` file in `contracts/`:
```env
PRIVATE_KEY=your_private_key_here
FEE_RECIPIENT=0xYourAddress
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

3. Deploy to Base mainnet:
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_RPC_URL \
  --broadcast \
  --verify
```

4. Note the deployed TokenFactory address for the frontend.

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourDeployedFactoryAddress
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Get a WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID to your `.env.local`

## Token Creation

Each token you create has:
- **Custom Name & Symbol** - Choose your branding
- **Custom Decimals** - Standard 18, or 6/8 for stablecoin-like tokens
- **Fixed Supply** - All tokens minted to your wallet on creation
- **Ownership** - You're the owner with burn capability

### Creation Fee

A small creation fee (0.0005 ETH, ~$1.50) is charged per token deployment. This covers:
- Gas optimization
- Contract verification
- Platform maintenance

## Farcaster Mini App

Base Token Forge works as a Farcaster Frame/Mini App:

1. Deploy to Vercel or similar
2. Update `NEXT_PUBLIC_APP_URL` in your environment
3. Share the link on Farcaster - it will render as an interactive Frame

## Tech Stack

- **Contracts**: Solidity, Foundry, OpenZeppelin
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Web3**: wagmi, viem, RainbowKit
- **Chain**: Base (Ethereum L2)

## Security

- Contracts use battle-tested OpenZeppelin ERC20
- No admin functions on deployed tokens
- Fully auditable, open source code

## License

MIT License - feel free to fork and build your own!

---

Built with 🔥 on Base

