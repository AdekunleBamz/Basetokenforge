// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/src/FeeCollector.sol";

contract FeeCollectorTest is Test {
    FeeCollector public collector;
    address public owner = address(this);
    address public user = address(0x1);
    address public recipient = address(0x3);

    function setUp() public {
        collector = new FeeCollector();
        vm.deal(user, 10 ether);
        vm.deal(address(collector), 1 ether); // Pre-fund for tests
    }

    function testOwnerIsDeployer() public {
        assertEq(collector.owner(), owner);
    }

    function testReceiveEth() public {
        uint256 balanceBefore = address(collector).balance;
        
        vm.prank(user);
        (bool success, ) = address(collector).call{value: 0.1 ether}("");
        
        assertTrue(success);
        assertEq(address(collector).balance, balanceBefore + 0.1 ether);
        assertEq(collector.totalCollected(), 0.1 ether);
    }

    function testWithdraw() public {
        uint256 ownerBalanceBefore = owner.balance;
        uint256 collectorBalance = address(collector).balance;
        
        collector.withdraw();
        
        assertEq(address(collector).balance, 0);
        assertEq(owner.balance, ownerBalanceBefore + collectorBalance);
    }

    function testWithdrawAmount() public {
        uint256 ownerBalanceBefore = owner.balance;
        uint256 withdrawAmount = 0.5 ether;
        
        collector.withdrawAmount(withdrawAmount);
        
        assertEq(address(collector).balance, 0.5 ether);
        assertEq(owner.balance, ownerBalanceBefore + withdrawAmount);
    }

    function testWithdrawTo() public {
        uint256 recipientBalanceBefore = recipient.balance;
        uint256 collectorBalance = address(collector).balance;
        
        collector.withdrawTo(recipient);
        
        assertEq(address(collector).balance, 0);
        assertEq(recipient.balance, recipientBalanceBefore + collectorBalance);
    }

    function testFailWithdrawNotOwner() public {
        vm.prank(user);
        collector.withdraw();
    }

    function testTransferOwnership() public {
        collector.transferOwnership(user);
        assertEq(collector.owner(), user);
        
        // New owner can withdraw
        vm.prank(user);
        collector.withdraw();
    }

    function testGetBalance() public {
        assertEq(collector.getBalance(), address(collector).balance);
    }
}
