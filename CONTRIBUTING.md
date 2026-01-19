# Contributing to Base Token Forge

First off, thank you for considering contributing to Base Token Forge! 🔥

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your browser/wallet information**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies** following the README setup instructions
3. **Make your changes** and test them locally
4. **Ensure your code follows the existing style**
5. **Write clear commit messages**
6. **Submit your pull request**

## Development Setup

### Prerequisites

- Node.js 18+
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for smart contracts)
- A wallet with ETH on Base (for testing deployments)

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Basetokenforge.git
cd Basetokenforge

# Install frontend dependencies
cd frontend
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

### Smart Contracts

```bash
cd contracts

# Install dependencies
forge install

# Run tests
forge test

# Build contracts
forge build
```

## Code Style

- **TypeScript/JavaScript**: Follow existing patterns in the codebase
- **Solidity**: Follow Solidity style guide, use OpenZeppelin patterns
- **CSS**: Use Tailwind CSS utility classes

## Commit Messages

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep the first line under 72 characters

Examples:
- `Add token search functionality`
- `Fix wallet connection on mobile`
- `Update README with deployment instructions`

## Questions?

Feel free to open an issue with the "question" label if you need help!

---

Thank you for contributing! 🚀
