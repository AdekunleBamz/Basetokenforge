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
     * @notice Create a new ERC20 token on Base
     * @dev Deploys a new ForgeToken contract and records it
     * @param name_ Token name (e.g., "My Token")
     * @param symbol_ Token symbol (e.g., "MTK")
     * @param decimals_ Token decimals (typically 18)
     * @param initialSupply_ Initial supply in smallest units (with decimals)
     * @return tokenAddress The address of the newly created token
     */
    function createToken(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_
    ) external payable returns (address tokenAddress) {
        require(msg.value >= creationFee, "TokenFactory: insufficient fee");
        require(bytes(name_).length > 0 && bytes(name_).length <= 64, "TokenFactory: invalid name length");
        require(bytes(symbol_).length > 0 && bytes(symbol_).length <= 11, "TokenFactory: invalid symbol length");
        require(decimals_ <= 18, "TokenFactory: decimals must be <= 18");
        require(initialSupply_ > 0, "TokenFactory: supply must be > 0");
        
        // Deploy new token on Base
        ForgeToken newToken = new ForgeToken(
            name_,
            symbol_,
            decimals_,
            initialSupply_,
            msg.sender
        );
        
        tokenAddress = address(newToken);
        
        // Record deployment
        deployedTokens.push(tokenAddress);
        tokensByCreator[msg.sender].push(tokenAddress);
        
        // Transfer fee to recipient
        if (msg.value > 0 && feeRecipient != address(0)) {
            totalFeesCollected += msg.value;
            (bool sent, ) = feeRecipient.call{value: msg.value}("");
            require(sent, "TokenFactory: fee transfer failed");
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
    
    // ============ View Functions ============
    
    /**
     * @notice Get total number of tokens deployed via this factory
     * @return Total count of deployed tokens
     */
    function getDeployedTokensCount() external view returns (uint256) {
        return deployedTokens.length;
    }
    
    /**
     * @notice Get all tokens created by a specific address
     * @param creator The creator's address
     * @return Array of token addresses
     */
    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return tokensByCreator[creator];
    }
    
    /**
     * @notice Get count of tokens created by a specific address
     * @param creator The creator's address
     * @return Number of tokens created
     */
    function getTokenCountByCreator(address creator) external view returns (uint256) {
        return tokensByCreator[creator].length;
    }
    
    /**
     * @notice Get most recently deployed tokens
     * @param count Number of recent tokens to retrieve
     * @return Array of token addresses (most recent first)
     */
    function getRecentTokens(uint256 count) external view returns (address[] memory) {
        uint256 total = deployedTokens.length;
        if (count > total) count = total;
        
        address[] memory recent = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            recent[i] = deployedTokens[total - 1 - i];
        }
        return recent;
    }
    
    /**
     * @notice Get a deployed token by index
     * @param index The index in the deployedTokens array
     * @return Token address at the given index
     */
    function getTokenAtIndex(uint256 index) external view returns (address) {
        require(index < deployedTokens.length, "TokenFactory: index out of bounds");
        return deployedTokens[index];
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Update the token creation fee
     * @param _newFee New fee amount in wei
     */
    function setCreationFee(uint256 _newFee) external onlyOwner {
        uint256 oldFee = creationFee;
        creationFee = _newFee;
        emit CreationFeeUpdated(oldFee, _newFee);
    }
    
    /**
     * @notice Update the fee recipient address
     * @param _newRecipient New recipient address
     */
    function setFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "TokenFactory: invalid recipient");
        address oldRecipient = feeRecipient;
        feeRecipient = _newRecipient;
        emit FeeRecipientUpdated(oldRecipient, _newRecipient);
    }
    
    /**
     * @notice Transfer contract ownership
     * @param _newOwner New owner address
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "TokenFactory: invalid owner address");
        address oldOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred(oldOwner, _newOwner);
    }
}

