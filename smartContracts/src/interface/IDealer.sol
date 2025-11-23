// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

interface IDealer {

    event L3Interaction(string indexed _backendDigest, bytes32 _jobDigest, uint256 indexed _chainId);
    event FundsTransferredToMediator(uint256 _amount);

    error InvalidChainId(string reason);
    error InvalidInteraction(string reason);
    error InvalidImplementation();
    error AuthenticationFailed(string reason);

    struct Job {
        bool status;
        bytes32 digest;
        uint256 value;
    }

    function depositAndExec(
        string calldata _backendDigest,
        uint256 _privateChainId,
        uint256 _totalAmount
    ) external payable;


}
