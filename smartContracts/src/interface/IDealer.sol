// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

interface IDealer {

    event L3Interaction(bytes indexed _backendDigest, bytes32 _jobDigest, uint256 indexed _chainId);

    error InvalidChainId(string reason);
    error InvalidInteraction(string reason);
    error InvalidImplementation();
    error AuthenticationFailed(string reason);

    function depositAndExec(
        bytes calldata _backendDigest,
        uint256 _privateChainId,
        uint256 _totalAmount
    ) external;


}
