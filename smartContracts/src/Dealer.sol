// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { ReentrancyGuardUpgradeable as ReentrancyGuard } from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable2StepUpgradeable as Ownable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "./interface/IDealer.sol";

contract Dealer is UUPSUpgradeable, ReentrancyGuard, Ownable, IDealer {

    using SafeERC20 for IERC20;

    mapping (address => bytes32) private jobDetails;
    mapping (bytes32 => bool) private jobStatus;

    uint256 private nonce;
    IERC20 public stableCoin;

    //---------------------------------  Initializer  ----------------------------------------//
    /// @notice Initializes the contract.
    function initialize() external initializer onlyProxy {

        __UUPSUpgradeable_init();
        __Ownable2Step_init();
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();

        nonce++;
    }

    /// @notice This function is used to deposit funds and transfer them anonymously
    /// @param _backendDigest The backend message digest
    /// @param _privateChainId The private chain id spined for this user
    /// @param _totalAmount The total amount of funds to be transferred
    function depositAndExec(
        bytes calldata _backendDigest,
        uint256 _privateChainId,
        uint256 _totalAmount
    ) external nonReentrant {

        if (_privateChainId == 0)
            revert InvalidChainId("Invalid ChainId");
        if (_totalAmount == 0)
            revert InvalidInteraction("Invalid Input Amount");

        bytes32 jobDigest = keccak256(abi.encodePacked(_backendDigest, _privateChainId, _totalAmount, block.timestamp, nonce));
        jobDetails[msg.sender] = jobDigest;
        jobStatus[jobDigest] = false;
        nonce++;
        stableCoin.safeTransfer(address(this), _totalAmount);

        emit L3Interaction(_backendDigest ,jobDigest, _privateChainId);
    }



    //---------------------------------  Internal Functions  ----------------------------------------//
    /// @notice Authorizes the upgrade to a new implementation contract.
    /// @param _implementation Address of the new implementation contract.
    function _authorizeUpgrade(
        address _implementation
    ) internal virtual override onlyOwner {
        if (_implementation.code.length <= 0) revert InvalidImplementation();
    }
}
