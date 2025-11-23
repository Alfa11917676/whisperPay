import axiosInstance from "./api/axiosInstance";

interface CheckStatusResponse {
	additionalInfo: { chainId: string };
	l3Exists: boolean;
	message: string;
	status: true;
}

export async function checkStatus(
	address: string
): Promise<CheckStatusResponse> {
	const response = await axiosInstance.get<CheckStatusResponse>(
		`/deploy-l3/status?wallet=${address}`
	);

	return response.data;
}

export async function createChain(address: string): Promise<boolean> {
	const response = await axiosInstance.post<{ status: boolean }>(
		`/deploy-l3`,
		{
			userWallet: address,
		}
	);

	return response.data.status;
}

export interface EncryptItem {
	recipient: string;
	amount: string;
}

interface EncryptResponse {
	status: boolean;
	message: string;
	l3ChainId: string;
	encryptedMessage: string;
}

export async function encryptItems(
	address: string,
	items: EncryptItem[]
): Promise<EncryptResponse> {
	const response = await axiosInstance.post<EncryptResponse>(
		`/deploy-l3/encrypt?wallet=${address}`,
		{ items }
	);

	return response.data;
}
