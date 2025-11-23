import { ethers } from "ethers";

export const truncateAddress = (
	address: string,
	startLength: number = 6,
	endLength: number = 4
): string => {
	if (!address || address.length <= startLength + endLength) {
		return address;
	}
	const start = address.slice(0, startLength);
	const end = address.slice(-endLength);
	return `${start}...${end}`;
};

export const isValidEthereumAddress = (address: string): boolean => {
	if (!address) return false;
	try {
		return ethers.utils.isAddress(address.trim());
	} catch {
		return false;
	}
};
