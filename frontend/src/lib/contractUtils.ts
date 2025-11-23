import { Address as AppKitAddress } from "@reown/appkit-adapter-ethers5";
import {
	BrowserProvider,
	Contract,
	JsonRpcProvider,
	JsonRpcSigner,
} from "ethers-v6";
import DealerABI from "./abi/Dealer.json";

export type ContractType = "Dealer";
export type Address = AppKitAddress;

export const ZERO = BigInt(0);

// L2 Contract Address on Arbitrum Sepolia
export const DEALER_CONTRACT_ADDRESS: AppKitAddress =
	"0x3c445CDc76e7feE6b4185826ff9790e8473c27C4";

interface ContractConfig {
	abi: () => Promise<any>;
	address: AppKitAddress;
}

const CONTRACT_CONFIG: Record<ContractType, ContractConfig> = {
	Dealer: {
		abi: async () => DealerABI,
		address: DEALER_CONTRACT_ADDRESS,
	},
};

/**
 * Get a contract instance with the appropriate signer or provider
 * @param contractName - Name of the contract to instantiate
 * @param provider - Ethers provider (JsonRpcProvider or BrowserProvider)
 * @param contractAddress - Optional custom contract address
 * @param signerAddress - Optional signer address (not used, kept for API compatibility)
 * @returns Contract instance or undefined if provider is not available
 */
export const getContract = async (
	contractName: ContractType,
	provider: JsonRpcProvider | BrowserProvider | undefined,
	contractAddress?: AppKitAddress,
	signerAddress?: AppKitAddress
): Promise<Contract | undefined> => {
	if (!provider) return;

	try {
		const abiModule = await CONTRACT_CONFIG[contractName]!.abi();
		// Handle both default export and direct export
		const abi = abiModule.default || abiModule;
		const address =
			contractAddress || CONTRACT_CONFIG[contractName]!.address;

		// For BrowserProvider (wallet transactions), create signer manually
		// For JsonRpcProvider (read-only), use provider directly
		let signerOrProvider;
		if (provider instanceof BrowserProvider) {
			if (signerAddress) {
				// Create JsonRpcSigner directly to avoid RPC calls
				// This is a workaround for AppKit's restricted RPC calls
				signerOrProvider = new JsonRpcSigner(provider, signerAddress);
				console.log("Using JsonRpcSigner for:", signerAddress);
			} else {
				// If no address provided, use provider directly (read-only mode)
				signerOrProvider = provider;
				console.log("Using BrowserProvider in read-only mode");
			}
		} else {
			// Use JsonRpcProvider directly for read operations
			signerOrProvider = provider;
			console.log("Using JsonRpcProvider");
		}

		const contract = new Contract(address, abi, signerOrProvider);
		return contract;
	} catch (e) {
		console.error("Error in getContract:", e);
		throw e;
	}
};

/**
 * Get a read-only contract instance (no signing capabilities)
 * @param contractName - Name of the contract to instantiate
 * @param provider - Ethers provider (JsonRpcProvider or BrowserProvider)
 * @param contractAddress - Optional custom contract address
 * @returns Contract instance or undefined if provider is not available
 */
export const getReadOnlyContract = async (
	contractName: ContractType,
	provider: JsonRpcProvider | BrowserProvider | undefined,
	contractAddress?: AppKitAddress
): Promise<Contract | undefined> => {
	if (!provider) return;

	try {
		const abiModule = await CONTRACT_CONFIG[contractName]!.abi();
		// Handle both default export and direct export
		const abi = abiModule.default || abiModule;
		const address =
			contractAddress || CONTRACT_CONFIG[contractName]!.address;

		// Use provider directly for read-only operations
		const contract = new Contract(address, abi, provider);
		return contract;
	} catch (e) {
		console.error("Error in getReadOnlyContract:", e);
		return undefined;
	}
};
