# Contributing to Base Token Forge

Thank you for your interest in contributing to Base Token Forge! 🔥

## How to Contribute

### Reporting Bugs

1. Check existing [Issues](https://github.com/AdekunleBamz/Basetokenforge/issues) to avoid duplicates
2. Open a new issue with a clear title and description
3. Include steps to reproduce, expected vs actual behavior

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its use case
3. Discuss implementation approach if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `cd contracts && forge test`
5. Commit with clear messages: `git commit -m "feat: add new feature"`
6. Push and open a Pull Request

### Development Setup

```bash
# Clone the repo
git clone https://github.com/AdekunleBamz/Basetokenforge.git
cd Basetokenforge

# Smart Contracts Setup
cd contracts
forge install
cp .env.example .env
# Edit .env with your values
forge test

# Frontend Setup
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

### Code Style

- **Smart Contracts**: Follow Solidity best practices, use OpenZeppelin standards
- **Frontend**: Use TypeScript, follow Next.js/React patterns
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)

### Testing

- All smart contract changes must include Foundry tests
- Ensure all existing tests pass before submitting
- Test on Base Sepolia testnet before mainnet

## Questions?

Feel free to open an issue for any questions or discussions.

---

Thank you for helping improve Base Token Forge! 🔥
