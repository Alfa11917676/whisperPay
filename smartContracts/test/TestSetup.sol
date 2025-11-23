// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@foundry-upgrades/ProxyTester.sol";
import "@core/L2Contracts/Dealer.sol";
import "forge-std/console.sol";

contract TestSetup is Test {
    // Contracts

    Dealer public dealer;

    // Variables
    address public deployer;
    address public admin;
    address public bob;
    address public carol;

    function setUp() public virtual {
        admin = address(uint160(uint(keccak256(abi.encodePacked("admin")))));
        deployer = address(uint160(uint(keccak256(abi.encodePacked("deployer")))));
        bob = address(uint160(uint(keccak256(abi.encodePacked("bob")))));
        carol = address(uint160(uint(keccak256(abi.encodePacked("carol")))));

        // ============================== Deploy mocks ============================================
        ProxyTester proxy = new ProxyTester();
        proxy.setType("uups");
        Dealer implementation = new Dealer();
        bytes memory data = abi.encodeWithSignature(
            "initialize(address)",
            admin
        );

        bytes memory wrongData = abi.encodeWithSignature(
            "initialize(address)",
            address(0)
        );

        vm.startPrank(admin);
        vm.expectRevert(abi.encodeWithSelector(IDealer.InvalidInteraction.selector, "Zero address cannot be passed"));
        address dealerProxy = proxy.deploy(address(implementation), deployer, wrongData);
        dealer = Dealer(payable(dealerProxy));

        dealerProxy = proxy.deploy(address(implementation), deployer, data);
        dealer = Dealer(payable(dealerProxy));

        vm.stopPrank();



    }
}
