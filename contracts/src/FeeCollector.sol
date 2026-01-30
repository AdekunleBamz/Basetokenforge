// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FeeCollector
 * @author Base Token Forge
 * @notice A simple contract to collect and withdraw token creation fees
 * @dev Deploy this contract, then set its address as the feeRecipient in TokenFactory.
 *      The owner can withdraw collected fees via Basescan at any time.
 */
contract FeeCollector {
    // ============ Events ============
    
    /// @notice Emitted when fees are withdrawn
    event Withdrawal(address indexed to, uint256 amount);
    
    /// @notice Emitted when fees are received
    event FeeReceived(address indexed from, uint256 amount);
    
    /// @notice Emitted when ownership is transferred
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ============ State Variables ============
    
    /// @notice Contract owner (can withdraw fees)
    address public owner;
    
    /// @notice Total fees collected (for tracking)
    uint256 public totalCollected;

    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "FeeCollector: caller is not the owner");
        _;
    }

    // ============ Constructor ============
    
    /**
     * @notice Initializes the FeeCollector with the deployer as owner
     */
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // ============ Receive Function ============
    
    /**
     * @notice Receives ETH fees from TokenFactory
     * @dev This function is called when ETH is sent to this contract
     */
    receive() external payable {
        totalCollected += msg.value;
        emit FeeReceived(msg.sender, msg.value);
    }

    // ============ Fallback Function ============
    
    /**
     * @notice Fallback function to receive ETH
     */
    fallback() external payable {
        totalCollected += msg.value;
        emit FeeReceived(msg.sender, msg.value);
    }

    // ============ Owner Functions ============
    
    /**
     * @notice Withdraw all collected fees to the owner's wallet
     * @dev Can be called directly from Basescan
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "FeeCollector: no fees to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "FeeCollector: withdrawal failed");
        
        emit Withdrawal(owner, balance);
    }

    /**
     * @notice Withdraw a specific amount of fees
     * @param amount The amount to withdraw in wei
     */
    function withdrawAmount(uint256 amount) external onlyOwner {
        require(amount > 0, "FeeCollector: amount must be > 0");
        require(address(this).balance >= amount, "FeeCollector: insufficient balance");
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "FeeCollector: withdrawal failed");
        
        emit Withdrawal(owner, amount);
    }

    /**
     * @notice Withdraw fees to a specific address
     * @param to The address to send fees to
     */
    function withdrawTo(address to) external onlyOwner {
        require(to != address(0), "FeeCollector: invalid address");
        uint256 balance = address(this).balance;
        require(balance > 0, "FeeCollector: no fees to withdraw");
        
        (bool success, ) = to.call{value: balance}("");
        require(success, "FeeCollector: withdrawal failed");
        
        emit Withdrawal(to, balance);
    }

    /**
     * @notice Transfer ownership to a new address
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "FeeCollector: invalid new owner");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    // ============ View Functions ============
    
    /**
     * @notice Get the current balance of the contract
     * @return The balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
