// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================
// REMIX DEPLOYMENT - ForgeToken.sol
// ============================================
// 1. Open Remix IDE: https://remix.ethereum.org
// 2. Create new file: ForgeToken.sol
// 3. Paste this entire code
// 4. Compile with Solidity 0.8.20
// 5. This contract is deployed BY the TokenFactory (not directly)
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

