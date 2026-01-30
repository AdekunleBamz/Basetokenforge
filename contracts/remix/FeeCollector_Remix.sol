// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================
// REMIX DEPLOYMENT - FeeCollector.sol
// ============================================
// 1. Open Remix IDE: https://remix.ethereum.org
// 2. Create new file: FeeCollector.sol
// 3. Paste this entire code
// 4. Compile with Solidity 0.8.20
// 5. Deploy to Base Mainnet:
//    - Environment: "Injected Provider - MetaMask"
//    - Make sure MetaMask is on Base Mainnet (Chain ID: 8453)
//    - No constructor arguments needed
// 6. Copy the deployed FeeCollector contract address
// 7. Use this address as _feeRecipient when deploying TokenFactory
// 
// TO WITHDRAW FEES VIA BASESCAN:
// 1. Go to https://basescan.org/address/YOUR_FEECOLLECTOR_ADDRESS
// 2. Click "Contract" tab -> "Write Contract"
// 3. Connect your wallet (must be owner)
// 4. Click "withdraw" function and confirm transaction
// ============================================

/**
 * @title FeeCollector
 * @notice A simple contract to collect and withdraw token creation fees
 * @dev Deploy this first, then use its address as feeRecipient in TokenFactory
 */
contract FeeCollector {
    // Events
    event Withdrawal(address indexed to, uint256 amount);
    event FeeReceived(address indexed from, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // State
    address public owner;
    uint256 public totalCollected;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /// @notice Receives ETH fees
    receive() external payable {
        totalCollected += msg.value;
        emit FeeReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        totalCollected += msg.value;
        emit FeeReceived(msg.sender, msg.value);
    }

    /// @notice Withdraw all fees to owner - CALL THIS FROM BASESCAN
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(owner, balance);
    }

    /// @notice Withdraw specific amount
    function withdrawAmount(uint256 amount) external onlyOwner {
        require(amount > 0 && address(this).balance >= amount, "Invalid amount");
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(owner, amount);
    }

    /// @notice Withdraw to different address
    function withdrawTo(address to) external onlyOwner {
        require(to != address(0), "Invalid address");
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees");
        
        (bool success, ) = to.call{value: balance}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(to, balance);
    }

    /// @notice Transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /// @notice Get current balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
