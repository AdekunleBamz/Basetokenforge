// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TokenFactory.sol";

/**
 * @title DeployScript
 * @dev Deployment script for Base Token Forge contracts on Base mainnet
 * 
 * Deployment Instructions:
 * 1. Set environment variables:
 *    - PRIVATE_KEY: Deployer's private key
 *    - FEE_RECIPIENT: Address to receive creation fees
 *    - BASE_RPC_URL: Base mainnet RPC URL
 * 
 * 2. Run deployment:
 *    forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_RPC_URL --broadcast --verify
 * 
 * Base Mainnet Details:
 * - Chain ID: 8453
 * - RPC: https://mainnet.base.org
 * - Explorer: https://basescan.org
 */
contract DeployScript is Script {
    // Base Mainnet Chain ID
    uint256 constant BASE_CHAIN_ID = 8453;
    
    // Base Sepolia Chain ID (for testnet deployments)
    uint256 constant BASE_SEPOLIA_CHAIN_ID = 84532;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address feeRecipient = vm.envAddress("FEE_RECIPIENT");
        
        // Verify we're on Base network
        require(
            block.chainid == BASE_CHAIN_ID || block.chainid == BASE_SEPOLIA_CHAIN_ID,
            "Deploy: Must deploy on Base mainnet or Base Sepolia"
        );
        
        // Creation fee: 0.00015 ETH (~$0.50 at current ETH prices)
        // This is significantly cheaper than Ethereum mainnet
        uint256 creationFee = 0.00015 ether;
        
        console.log("=== Base Token Forge Deployment ===");
        console.log("Chain ID:", block.chainid);
        console.log("Network:", block.chainid == BASE_CHAIN_ID ? "Base Mainnet" : "Base Sepolia");
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);
        
        TokenFactory factory = new TokenFactory(creationFee, feeRecipient);
        
        console.log("Deployment successful!");
        console.log("TokenFactory deployed at:", address(factory));
        console.log("Creation fee:", creationFee, "wei");
        console.log("Creation fee (ETH):", creationFee / 1e18);
        console.log("Fee recipient:", feeRecipient);
        console.log("");
        console.log("Verify on Basescan:");
        if (block.chainid == BASE_CHAIN_ID) {
            console.log("https://basescan.org/address/", address(factory));
        } else {
            console.log("https://sepolia.basescan.org/address/", address(factory));
        }
        
        vm.stopBroadcast();
    }
}

