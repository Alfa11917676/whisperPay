// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { ReentrancyGuardUpgradeable as ReentrancyGuard } from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable2StepUpgradeable as Ownable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "../interface/IDealer.sol";


contract Dealer is UUPSUpgradeable, Ownable, ReentrancyGuard, IDealer {

    using SafeERC20 for IERC20;

    address public mediator;
    mapping (address => Job) private jobDetails;

    uint256 private nonce;
    IERC20 public stableCoin;

    //---------------------------------  Initializer  ----------------------------------------//
    /// @notice Initializes the contract.
    function initialize(address _mediator, address _stableCoin) external initializer onlyProxy {

        __UUPSUpgradeable_init();
        __Ownable2Step_init();
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();

        mediator = _mediator;
        stableCoin = IERC20(_stableCoin);
        nonce++;
    }

    /// @notice This function is used to deposit funds and transfer them anonymously
    /// @param _backendDigest The backend message digest
    /// @param _privateChainId The private chain id spined for this user
    /// @param _totalAmount The total amount of funds to be transferred
    function depositAndExec(
        string calldata _backendDigest,
        uint256 _privateChainId,
        uint256 _totalAmount
    ) external payable nonReentrant {

        if (_privateChainId == 0)
            revert InvalidChainId("Invalid ChainId");
        if (_totalAmount == 0)
            revert InvalidInteraction("Invalid Input Amount");
        if (msg.value != _totalAmount)
            revert InvalidInteraction("Funds mismatch");

        bool previousJobStatus = jobDetails[msg.sender].status;
        if (previousJobStatus == false)
            revert InvalidInteraction("Previous Job Not finished");

        bytes32 jobDigest = keccak256(abi.encodePacked(_backendDigest, _privateChainId, _totalAmount, block.timestamp, nonce));
        jobDetails[msg.sender] = Job({
            status: false,
            digest: jobDigest,
            value: _totalAmount
        });
        nonce++;

        emit L3Interaction(_backendDigest ,jobDigest, _privateChainId);
    }

    function transferToWhisperRouter(address _jobCreator) external onlyOwner {

        Job memory job = jobDetails[_jobCreator];
        if (job.status == true)
            revert InvalidInteraction("No latest interaction required");
//        stableCoin.safeTransfer(mediator, job.value);
        payable(mediator).transfer(job.value);

        emit FundsTransferredToMediator(job.value);
    }

    //-------------------------------- VIEW FUNCTIONS ------------------------------------------------//

    function getJobDetails(address _creator) external view returns(Job memory) {
        return jobDetails[_creator];
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
