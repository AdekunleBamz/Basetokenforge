// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/src/TokenFactory.sol";
import "../contracts/src/ForgeToken.sol";

contract TokenFactoryTest is Test {
    TokenFactory public factory;
    address public owner = address(this);
    address public user = address(0x1);
    address public feeRecipient = address(0x2);
    uint256 public creationFee = 0.0005 ether;

    function setUp() public {
        factory = new TokenFactory(creationFee, feeRecipient);
        vm.deal(user, 10 ether);
    }

    function testCreateToken() public {
        vm.startPrank(user);
        
        uint256 initialSupply = 1_000_000 * 10**18;
        
        address tokenAddress = factory.createToken{value: creationFee}(
            "Test Token",
            "TEST",
            18,
            initialSupply
        );
        
        ForgeToken token = ForgeToken(tokenAddress);
        
        assertEq(token.name(), "Test Token");
        assertEq(token.symbol(), "TEST");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), initialSupply);
        assertEq(token.balanceOf(user), initialSupply);
        assertEq(token.owner(), user);
        
        vm.stopPrank();
    }

    function testCreationFee() public {
        uint256 recipientBalanceBefore = feeRecipient.balance;
        
        vm.prank(user);
        factory.createToken{value: creationFee}(
            "Fee Token",
            "FEE",
            18,
            1000 * 10**18
        );
        
        assertEq(feeRecipient.balance, recipientBalanceBefore + creationFee);
    }

    function testFailInsufficientFee() public {
        vm.prank(user);
        factory.createToken{value: creationFee - 1}(
            "Fail Token",
            "FAIL",
            18,
            1000 * 10**18
        );
    }

    function testGetTokensByCreator() public {
        vm.startPrank(user);
        
        factory.createToken{value: creationFee}("Token1", "TK1", 18, 1000 * 10**18);
        factory.createToken{value: creationFee}("Token2", "TK2", 18, 2000 * 10**18);
        
        address[] memory userTokens = factory.getTokensByCreator(user);
        assertEq(userTokens.length, 2);
        
        vm.stopPrank();
    }

    function testGetDeployedTokensCount() public {
        vm.startPrank(user);
        
        factory.createToken{value: creationFee}("Token1", "TK1", 18, 1000 * 10**18);
        factory.createToken{value: creationFee}("Token2", "TK2", 18, 2000 * 10**18);
        
        assertEq(factory.getDeployedTokensCount(), 2);
        
        vm.stopPrank();
    }

    function testSetCreationFee() public {
        uint256 newFee = 0.001 ether;
        factory.setCreationFee(newFee);
        assertEq(factory.creationFee(), newFee);
    }

    function testCustomDecimals() public {
        vm.prank(user);
        address tokenAddress = factory.createToken{value: creationFee}(
            "USDC Clone",
            "USDCC",
            6,
            1_000_000 * 10**6
        );
        
        ForgeToken token = ForgeToken(tokenAddress);
        assertEq(token.decimals(), 6);
    }
}

