// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ForgeToken.sol";

/**
 * @title TokenFactory
 * @author Base Token Forge
 * @notice Factory contract for deploying ERC20 tokens on Base L2
 * @dev This factory enables anyone to create standard ERC20 tokens on Base
 *      with minimal gas costs. Key features:
 *      - One-click token deployment
 *      - Configurable creation fee
 *      - Token tracking by creator
 *      - Recent tokens query
 * 
 * Base Network Benefits:
 * - Gas costs ~100x lower than Ethereum mainnet
 * - Fast block times (~2 seconds)
 * - Ethereum security via L2 rollup
 */
contract TokenFactory {
    // ============ Events ============
    
    /// @notice Emitted when a new token is created
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply,
        uint256 timestamp
    );
    
    /// @notice Emitted when the creation fee is updated
    event CreationFeeUpdated(uint256 oldFee, uint256 newFee);
    
    /// @notice Emitted when the fee recipient is updated
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    
    /// @notice Emitted when ownership is transferred
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ============ State Variables ============
    
    /// @notice Array of all deployed token addresses
    address[] public deployedTokens;
    
    /// @notice Mapping of creator address to their deployed tokens
    mapping(address => address[]) public tokensByCreator;
    
    /// @notice Fee required to create a new token (in wei)
    uint256 public creationFee;
    
    /// @notice Address that receives creation fees
    address public feeRecipient;
    
    /// @notice Contract owner address
    address public owner;
    
    /// @notice Total fees collected (for analytics)
    uint256 public totalFeesCollected;

    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "TokenFactory: caller is not the owner");
        _;
    }
    
    // ============ Constructor ============
    
    /**
     * @notice Initializes the TokenFactory
     * @param _creationFee Initial fee for token creation (in wei)
     * @param _feeRecipient Address to receive creation fees
     */
    constructor(uint256 _creationFee, address _feeRecipient) {
        require(_feeRecipient != address(0), "TokenFactory: invalid fee recipient");
        
        owner = msg.sender;
        creationFee = _creationFee;
        feeRecipient = _feeRecipient;
        
        emit OwnershipTransferred(address(0), msg.sender);
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

