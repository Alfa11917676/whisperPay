// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./TestSetup.sol";

contract TestInteraction is TestSetup{

    function testInteraction() public {

        vm.deal(bob, 1 ether);

        vm.prank(bob);
        dealer.depositAndExec{value: 0.01 ether}(
            "data",
            123,
            0.01 ether
        );

        IDealer.Job memory job = dealer.getJobDetails(bob);

        assertEq(job.value, 0.01 ether);
    }

}
