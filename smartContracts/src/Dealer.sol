// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { ReentrancyGuardUpgradeable as ReentrancyGuard } from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "./interface/IDealer.sol";

contract Dealer is UUPSUpgradeable, ReentrancyGuard, IDealer {
    constructor(){

    }
}
