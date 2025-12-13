// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TokenFactory.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address feeRecipient = vm.envAddress("FEE_RECIPIENT");
        
        // Creation fee: 0.0005 ETH (~$1.50 at current prices)
        uint256 creationFee = 0.0005 ether;
        
        vm.startBroadcast(deployerPrivateKey);
        
        TokenFactory factory = new TokenFactory(creationFee, feeRecipient);
        
        console.log("TokenFactory deployed at:", address(factory));
        console.log("Creation fee:", creationFee);
        console.log("Fee recipient:", feeRecipient);
        
        vm.stopBroadcast();
    }
}

