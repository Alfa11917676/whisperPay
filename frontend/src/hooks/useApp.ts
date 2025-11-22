"use client";

import { checkStatus, createChain } from "@/lib/apis";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect } from "react";

export function useApp() {
	const { address, isConnected } = useAppKitAccount();

	async function createOwnChain(address: string) {
		const result = await createChain(address as string);
		console.log(result);
	}

	async function fetchUserStatus(address: string) {
		const response = await checkStatus(address as string);

		if (response.l3Exists) {
			return;
		} else {
			return createOwnChain(address);
		}
	}

	useEffect(() => {
		if (isConnected && address) {
			fetchUserStatus(address);
		}
	}, [address, isConnected]);
}
