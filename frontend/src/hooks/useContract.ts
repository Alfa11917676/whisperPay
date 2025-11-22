import { useMemo } from "react";
import { useAppKitProvider } from "@reown/appkit/react";
import { ethers } from "ethers";
import DealerABI from "../lib/abi/Dealer.json";

// L2 Contract Address on Arbitrum Sepolia
export const DEALER_CONTRACT_ADDRESS =
	"0x59C899f52F2c40cBE5090bbc9A4f830B64a20Fc4";

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

	// Create ethers provider from wallet provider
	const ethersProvider = useMemo(() => {
		if (!walletProvider) return null;
		return new ethers.providers.Web3Provider(walletProvider as any);
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

		try {
			const signer = ethersProvider.getSigner();
			const contract = new ethers.Contract(
				DEALER_CONTRACT_ADDRESS,
				DealerABI,
				signer
			);

			// Convert total amount to Wei (assuming totalAmount is in ETH)
			const totalAmountWei = ethers.utils.parseEther(params.totalAmount);

			console.log("Calling depositAndExec with params:", {
				backendDigest: params.backendDigest,
				privateChainId: params.privateChainId,
				totalAmount: totalAmountWei.toString(),
			});

			// Call the contract function
			const tx = await contract.depositAndExec(
				params.backendDigest,
				params.privateChainId,
				totalAmountWei
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
			const contract = new ethers.Contract(
				DEALER_CONTRACT_ADDRESS,
				DealerABI,
				ethersProvider
			);

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
		isReady: !!ethersProvider,
	};
};
