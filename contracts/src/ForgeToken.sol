// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ForgeToken
 * @author Base Token Forge
 * @notice Standard ERC20 token deployed via BaseTokenForge factory on Base L2
 * @dev This token is created through the TokenFactory contract and includes:
 *      - Standard ERC20 functionality
 *      - Burnable extension for supply reduction
 *      - Ownable for administrative functions
 *      - Custom decimals support
 * 
 * Base Network: This contract is optimized for deployment on Base L2,
 * offering significantly lower gas costs compared to Ethereum mainnet.
 */
contract ForgeToken is ERC20, ERC20Burnable, Ownable {
    /// @notice Custom decimals for this token
    uint8 private immutable _decimals;
    
    /// @notice Address of the factory that created this token
    address public immutable factory;
    
    /// @notice Timestamp when the token was created
    uint256 public immutable createdAt;
    
    /// @dev Emitted when the token is created
    event TokenInitialized(
        address indexed owner,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply
    );
    
    /**
     * @notice Creates a new ForgeToken
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param decimals_ The number of decimals (typically 18)
     * @param initialSupply_ The initial supply to mint (in smallest units)
     * @param owner_ The address that will own the token and receive initial supply
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        require(bytes(name_).length > 0, "ForgeToken: name required");
        require(bytes(symbol_).length > 0, "ForgeToken: symbol required");
        require(initialSupply_ > 0, "ForgeToken: supply must be > 0");
        require(owner_ != address(0), "ForgeToken: invalid owner");
        
        _decimals = decimals_;
        factory = msg.sender;
        createdAt = block.timestamp;
        
        _mint(owner_, initialSupply_);
        
        emit TokenInitialized(owner_, name_, symbol_, decimals_, initialSupply_);
    }
    
    /**
     * @notice Returns the number of decimals for this token
     * @return The number of decimals
     */
    function decimals() public view override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @notice Returns the factory address that created this token
     * @return The factory contract address
     */
    function getFactory() external view returns (address) {
        return factory;
    }
    
    /**
     * @notice Returns token creation timestamp
     * @return Unix timestamp of token creation
     */
    function getCreatedAt() external view returns (uint256) {
        return createdAt;
    }
}

