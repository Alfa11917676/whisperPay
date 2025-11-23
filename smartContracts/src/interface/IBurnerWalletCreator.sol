// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

interface IBurnerWalletCreator {


    event BurnerWalletCreated(address indexed burnerWallet, string indexed jobId);
    event FundsTransferredToMediator(address _mediator, string _data, uint256 _amount);

    function deployBurner(string calldata _backendDigest, uint256 tokenAmount) external;

}
