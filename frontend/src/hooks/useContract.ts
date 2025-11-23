"use client";

import { useMemo } from "react";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, parseEther } from "ethers-v6";
import {
	getContract,
	DEALER_CONTRACT_ADDRESS,
	type Address,
} from "@/lib/contractUtils";

// Re-export for convenience
export { DEALER_CONTRACT_ADDRESS };

export interface DepositAndExecParams {
	backendDigest: string; // encryptedMessage
	privateChainId: string; // l3ChainId
	totalAmount: string; // total amount in ETH
}

/**
 * Custom hook to interact with the Dealer contract
 * @returns Contract interaction functions
 */
export const useContract = () => {
	const { walletProvider } = useAppKitProvider("eip155");
	const { address: walletAddress, isConnected } = useAppKitAccount();

	// Create ethers provider from wallet provider
	const ethersProvider = useMemo(() => {
		if (!walletProvider) return null;
		try {
			return new BrowserProvider(walletProvider as any);
		} catch (error) {
			console.error("Error creating ethers provider:", error);
			return null;
		}
	}, [walletProvider]);

	/**
	 * Calls the depositAndExec function on the Dealer contract
	 * @param params - Parameters for depositAndExec
	 * @returns Transaction receipt
	 */
	const depositAndExec = async (params: DepositAndExecParams) => {
		if (!ethersProvider) {
			throw new Error("Wallet provider not available");
		}

		if (!isConnected || !walletAddress) {
			throw new Error("No wallet connected. Please connect your wallet.");
		}

		try {
			console.log(
				"Getting contract instance for address:",
				walletAddress
			);

			// Get contract instance with signer (pass wallet address for AppKit)
			const contract = await getContract(
				"Dealer",
				ethersProvider,
				undefined,
				walletAddress as Address
			);

			if (!contract) {
				throw new Error("Failed to initialize contract");
			}

			// Convert total amount to Wei (assuming totalAmount is in ETH)
			const totalAmountWei = parseEther(params.totalAmount);

			console.log("Calling depositAndExec with params:", {
				backendDigest: params.backendDigest,
				privateChainId: params.privateChainId,
				totalAmount: totalAmountWei.toString(),
			});

			// Call the contract function
			const tx = await contract.depositAndExec(
				params.backendDigest,
				params.privateChainId,
				totalAmountWei,
				{
					value: totalAmountWei,
				}
			);

			console.log("Transaction sent:", tx.hash);

			// Wait for transaction confirmation
			const receipt = await tx.wait();
			console.log("Transaction confirmed:", receipt);

			return receipt;
		} catch (error) {
			console.error("Error calling depositAndExec:", error);
			throw error;
		}
	};

	/**
	 * Get job details for a creator address
	 * @param creatorAddress - Address of the job creator
	 * @returns Job details
	 */
	const getJobDetails = async (creatorAddress: string) => {
		if (!ethersProvider) {
			throw new Error("Wallet provider not available");
		}

		try {
			// Get contract instance (pass wallet address if available)
			const contract = await getContract(
				"Dealer",
				ethersProvider,
				undefined,
				walletAddress as Address | undefined
			);

			if (!contract) {
				throw new Error("Failed to initialize contract");
			}

			const jobDetails = await contract.getJobDetails(creatorAddress);
			return jobDetails;
		} catch (error) {
			console.error("Error getting job details:", error);
			throw error;
		}
	};

	return {
		depositAndExec,
		getJobDetails,
		isReady: !!ethersProvider && isConnected && !!walletAddress,
	};
};
