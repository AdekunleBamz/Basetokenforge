// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {ForgeToken} from "../src/ForgeToken.sol";
import {TokenFactory} from "../src/TokenFactory.sol";

/**
 * @title ForgeTokenTest
 * @notice Unit tests for the ForgeToken contract
 * @dev Tests token initialization, transfers, approvals, and edge cases
 */
contract ForgeTokenTest is Test {
    ForgeToken public token;
    address public creator;
    address public user1;
    address public user2;

    string constant TOKEN_NAME = "Test Token";
    string constant TOKEN_SYMBOL = "TEST";
    uint8 constant TOKEN_DECIMALS = 18;
    uint256 constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    function setUp() public {
        creator = makeAddr("creator");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        vm.prank(creator);
        token = new ForgeToken(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS, INITIAL_SUPPLY, creator);
    }

    // ============ Initialization Tests ============

    function test_TokenName() public view {
        assertEq(token.name(), TOKEN_NAME);
    }

    function test_TokenSymbol() public view {
        assertEq(token.symbol(), TOKEN_SYMBOL);
    }

    function test_TokenDecimals() public view {
        assertEq(token.decimals(), TOKEN_DECIMALS);
    }

    function test_TotalSupply() public view {
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
    }

    function test_CreatorReceivesAllTokens() public view {
        assertEq(token.balanceOf(creator), INITIAL_SUPPLY);
    }

    function test_FactoryAddress() public view {
        assertEq(token.factory(), creator);
    }

    function test_CreatedAtTimestamp() public view {
        assertEq(token.createdAt(), block.timestamp);
    }

    // ============ Transfer Tests ============

    function test_Transfer() public {
        uint256 amount = 1000 * 10 ** 18;
        
        vm.prank(creator);
        token.transfer(user1, amount);
        
        assertEq(token.balanceOf(user1), amount);
        assertEq(token.balanceOf(creator), INITIAL_SUPPLY - amount);
    }

    function test_TransferEmitsEvent() public {
        uint256 amount = 1000 * 10 ** 18;
        
        vm.expectEmit(true, true, false, true);
        emit ForgeToken.Transfer(creator, user1, amount);
        
        vm.prank(creator);
        token.transfer(user1, amount);
    }

    function test_RevertTransferInsufficientBalance() public {
        uint256 tooMuch = INITIAL_SUPPLY + 1;
        
        vm.prank(creator);
        vm.expectRevert();
        token.transfer(user1, tooMuch);
    }

    function test_TransferFromZeroAddress() public {
        // This should be handled by ERC20's internal checks
        vm.expectRevert();
        vm.prank(address(0));
        token.transfer(user1, 100);
    }

    // ============ Approval Tests ============

    function test_Approve() public {
        uint256 amount = 500 * 10 ** 18;
        
        vm.prank(creator);
        token.approve(user1, amount);
        
        assertEq(token.allowance(creator, user1), amount);
    }

    function test_ApproveEmitsEvent() public {
        uint256 amount = 500 * 10 ** 18;
        
        vm.expectEmit(true, true, false, true);
        emit ForgeToken.Approval(creator, user1, amount);
        
        vm.prank(creator);
        token.approve(user1, amount);
    }

    function test_TransferFrom() public {
        uint256 amount = 500 * 10 ** 18;
        
        vm.prank(creator);
        token.approve(user1, amount);
        
        vm.prank(user1);
        token.transferFrom(creator, user2, amount);
        
        assertEq(token.balanceOf(user2), amount);
        assertEq(token.allowance(creator, user1), 0);
    }

    function test_RevertTransferFromInsufficientAllowance() public {
        uint256 approved = 100 * 10 ** 18;
        uint256 attempt = 200 * 10 ** 18;
        
        vm.prank(creator);
        token.approve(user1, approved);
        
        vm.prank(user1);
        vm.expectRevert();
        token.transferFrom(creator, user2, attempt);
    }

    // ============ Fuzz Tests ============

    function testFuzz_Transfer(uint256 amount) public {
        amount = bound(amount, 0, INITIAL_SUPPLY);
        
        vm.prank(creator);
        token.transfer(user1, amount);
        
        assertEq(token.balanceOf(user1), amount);
    }

    function testFuzz_Approve(uint256 amount) public {
        vm.prank(creator);
        token.approve(user1, amount);
        
        assertEq(token.allowance(creator, user1), amount);
    }

    // ============ Edge Cases ============

    function test_ZeroTransfer() public {
        vm.prank(creator);
        token.transfer(user1, 0);
        
        assertEq(token.balanceOf(user1), 0);
        assertEq(token.balanceOf(creator), INITIAL_SUPPLY);
    }

    function test_SelfTransfer() public {
        uint256 balanceBefore = token.balanceOf(creator);
        
        vm.prank(creator);
        token.transfer(creator, 100);
        
        assertEq(token.balanceOf(creator), balanceBefore);
    }
}
