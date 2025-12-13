// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================
// REMIX DEPLOYMENT - TokenFactory.sol
// ============================================
// 1. Open Remix IDE: https://remix.ethereum.org
// 2. Create new file: TokenFactory.sol
// 3. Paste this entire code
// 4. Compile with Solidity 0.8.20
// 5. Deploy to Base Mainnet:
//    - Environment: "Injected Provider - MetaMask"
//    - Make sure MetaMask is on Base Mainnet (Chain ID: 8453)
//    - Constructor args:
//      _creationFee: 150000000000000 (0.00015 ETH in wei, ~$0.50)
//      _feeRecipient: YOUR_WALLET_ADDRESS
// 6. Copy the deployed contract address
// 7. Update NEXT_PUBLIC_FACTORY_ADDRESS in frontend/.env.local
// ============================================

import "@openzeppelin/contracts@5.0.0/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

/**
 * @title ForgeToken
 * @dev Standard ERC20 token deployed via BaseTokenForge factory
 */
contract ForgeToken is ERC20, ERC20Burnable, Ownable {
    uint8 private immutable _decimals;
    
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        _decimals = decimals_;
        _mint(owner_, initialSupply_);
    }
    
    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}

/**
 * @title TokenFactory
 * @dev Factory contract for deploying ERC20 tokens on Base mainnet
 */
contract TokenFactory {
    // Events
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply,
        uint256 timestamp
    );

    // State
    address[] public deployedTokens;
    mapping(address => address[]) public tokensByCreator;
    
    // Fee configuration
    uint256 public creationFee;
    address public feeRecipient;
    address public owner;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(uint256 _creationFee, address _feeRecipient) {
        owner = msg.sender;
        creationFee = _creationFee;
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Create a new ERC20 token
     * @param name_ Token name
     * @param symbol_ Token symbol
     * @param decimals_ Token decimals (typically 18)
     * @param initialSupply_ Initial supply (in smallest units, including decimals)
     */
    function createToken(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_
    ) external payable returns (address) {
        require(msg.value >= creationFee, "Insufficient fee");
        require(bytes(name_).length > 0, "Name required");
        require(bytes(symbol_).length > 0, "Symbol required");
        require(initialSupply_ > 0, "Supply must be > 0");
        
        // Deploy new token
        ForgeToken newToken = new ForgeToken(
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            msg.sender
        );
        
        address tokenAddress = address(newToken);
        
        // Record deployment
        deployedTokens.push(tokenAddress);
        tokensByCreator[msg.sender].push(tokenAddress);
        
        // Transfer fee to recipient
        if (msg.value > 0 && feeRecipient != address(0)) {
            (bool sent, ) = feeRecipient.call{value: msg.value}("");
            require(sent, "Fee transfer failed");
        }
        
        emit TokenCreated(
            tokenAddress,
            msg.sender,
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            block.timestamp
        );
        
        return tokenAddress;
    }
    
    // View functions
    function getDeployedTokensCount() external view returns (uint256) {
        return deployedTokens.length;
    }
    
    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return tokensByCreator[creator];
    }
    
    function getRecentTokens(uint256 count) external view returns (address[] memory) {
        uint256 total = deployedTokens.length;
        if (count > total) count = total;
        
        address[] memory recent = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            recent[i] = deployedTokens[total - 1 - i];
        }
        return recent;
    }
    
    // Admin functions
    function setCreationFee(uint256 _newFee) external onlyOwner {
        creationFee = _newFee;
    }
    
    function setFeeRecipient(address _newRecipient) external onlyOwner {
        feeRecipient = _newRecipient;
    }
    
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
}

