# Base Token Forge - Development Guide

## Overview

Base Token Forge is a modern, user-friendly platform for creating and managing ERC20 tokens on Base L2. This guide covers development setup, architecture, and best practices.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
4. [Development Workflow](#development-workflow)
5. [Smart Contracts](#smart-contracts)
6. [Frontend Components](#frontend-components)
7. [Testing](#testing)
8. [Deployment](#deployment)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Foundry (for smart contracts)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/Basetokenforge.git
cd base-token-forge

# Install frontend dependencies
cd frontend
pnpm install

# Install contract dependencies
cd ../contracts
forge install
```

### Environment Setup

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_id
NEXT_PUBLIC_BASESCAN_API_KEY=your_basescan_key
```

### Running Locally

```bash
# Start frontend development server
cd frontend
pnpm dev

# Run contract tests
cd contracts
forge test
```

## Project Structure

```
base-token-forge/
├── contracts/           # Solidity smart contracts
│   ├── src/            # Contract source files
│   ├── script/         # Deployment scripts
│   ├── test/           # Contract tests
│   └── remappings.txt  # Import remappings
├── frontend/           # Next.js frontend
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   ├── components/ # React components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utility libraries
│   │   ├── context/   # React contexts
│   │   ├── types/     # TypeScript types
│   │   └── config/    # Configuration files
│   └── public/        # Static assets
└── scripts/           # Utility scripts
```

## Architecture

### Frontend Architecture

The frontend uses Next.js 14 with the App Router pattern:

- **App Router**: File-based routing with layouts
- **Server Components**: Default for optimal performance
- **Client Components**: For interactive features
- **wagmi/viem**: Ethereum interactions
- **Tailwind CSS**: Styling

### State Management

- **React Context**: For global state (network, creation flow)
- **Custom Hooks**: For feature-specific logic
- **Local Storage**: For persistence (tokens, preferences)

### Smart Contract Architecture

- **TokenFactory**: Creates new ERC20 tokens
- **ForgeToken**: Standard ERC20 with optional features
- **OpenZeppelin**: Battle-tested base contracts

## Development Workflow

### Branch Strategy

```bash
main        # Production-ready code
develop     # Integration branch
feature/*   # Feature branches
fix/*       # Bug fix branches
```

### Commit Convention

Follow conventional commits:

```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
test(scope): add tests
chore(scope): maintenance
```

### Code Quality

- ESLint for linting
- Prettier for formatting
- TypeScript for type safety
- Husky for pre-commit hooks

## Smart Contracts

### TokenFactory Contract

Creates new ERC20 tokens with customizable parameters:

```solidity
function createToken(
    string memory name,
    string memory symbol,
    uint256 initialSupply
) external returns (address);
```

### ForgeToken Contract

Standard ERC20 with:

- Mintable (optional)
- Burnable (optional)
- Pausable (optional)
- Owner controls

### Testing Contracts

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testCreateToken
```

### Deploying Contracts

```bash
# Deploy to Base Sepolia
forge script script/Deploy.s.sol --rpc-url base-sepolia --broadcast

# Deploy to Base Mainnet
forge script script/Deploy.s.sol --rpc-url base --broadcast
```

## Frontend Components

### Core Components

- `TokenCreator`: Token creation wizard
- `TokenCard`: Token display card
- `ConnectWalletButton`: Wallet connection
- `NetworkSwitcher`: Chain selection

### Custom Hooks

- `useBaseFees`: Gas estimation for Base
- `useTokenTransfer`: Token transfers
- `useRecentTokens`: Recent token history
- `useContractWrite`: Contract interactions

### Utility Libraries

- `base-network.ts`: Chain configuration
- `contract-utils.ts`: Contract helpers
- `token-metadata.ts`: Token formatting
- `basescan-api.ts`: Explorer API

## Testing

### Frontend Tests

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run e2e tests
pnpm test:e2e
```

### Contract Tests

```bash
# Run Foundry tests
forge test

# Run with gas report
forge test --gas-report

# Generate coverage
forge coverage
```

## Deployment

### Frontend Deployment

The frontend is deployed on Vercel:

1. Push to main branch
2. Vercel auto-deploys
3. Preview deployments for PRs

### Contract Deployment

1. Set up environment variables
2. Run deployment script
3. Verify on Basescan
4. Update frontend config

## Base L2 Specifics

### Gas Optimization

Base L2 offers significantly lower gas costs:

- ~2 second block times
- Low priority fees (~0.001 gwei)
- Efficient L2 data compression

### Network Configuration

```typescript
// Base Mainnet
chainId: 8453
rpcUrl: 'https://mainnet.base.org'
explorer: 'https://basescan.org'

// Base Sepolia
chainId: 84532
rpcUrl: 'https://sepolia.base.org'
explorer: 'https://sepolia.basescan.org'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## Resources

- [Base Documentation](https://docs.base.org)
- [wagmi Documentation](https://wagmi.sh)
- [Foundry Book](https://book.getfoundry.sh)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

## License

MIT License - see LICENSE file for details.
