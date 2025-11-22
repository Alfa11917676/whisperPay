// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
import { Ownable2Step as Ownable } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IBurnerWallet} from "../interface/IBurnerWallet.sol";

contract BurnerWallet is IBurnerWallet, Ownable, ReentrancyGuard{

    address public walletOwner;
    address public mediator;

    string public backendDigest;
    IERC20 public stableCoin;

    constructor(string calldata _backendDigest, address _tokenAddress) Ownable(msg.sender){
        backendDigest = _backendDigest;
        stableCoin = IERC20(_tokenAddress);
    }

    function executeBurnerTransaction (address[] _receivers, uint256[] _amounts) external nonReentrant onlyOwner{

        if (_receivers.length == 0 || _amounts.length == 0) revert InvalidInteraction("Invalid user inputs");
        if (_receivers.length != _amounts.length) revert InvalidInteraction("Inconsistent inputs");

        // bridge the funds
    }

}
