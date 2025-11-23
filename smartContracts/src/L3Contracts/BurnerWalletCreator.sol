// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./BurnerWallet.sol";
import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IBurnerWalletCreator} from "../interface/IBurnerWalletCreator.sol";

contract BurnerWalletCreator is Ownable2Step, ReentrancyGuard , IBurnerWalletCreator{

    using SafeERC20 for IERC20;

    address public mediator;

    mapping (string => address) private jobToL3WalletLinker;

    uint256 private nonce;
    IERC20 public stableCoin;

   constructor (address _stableCoin) Ownable(msg.sender) {
     mediator  = msg.sender;
       stableCoin = IERC20(_stableCoin);
   }

    /// @notice This function is not totally built and will be completely built post hackathon
    function deployBurner(string calldata _backendDigest, uint256 tokenAmount) external onlyOwner {

        BurnerWallet burner = new BurnerWallet(_backendDigest, address(stableCoin));
        jobToL3WalletLinker[_backendDigest] = address(burner);

    }

    function transferFundsToMediator(string memory _data, uint256 _amount) external onlyOwner{

        stableCoin.safeTransfer(mediator, _amount);
        emit FundsTransferredToMediator(mediator, _data, _amount);
    }
}
