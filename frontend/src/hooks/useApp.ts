"use client";

import { checkStatus, createChain } from "@/lib/apis";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState } from "react";

export function useApp() {
	const { address, isConnected } = useAppKitAccount();
	const [showChainModal, setShowChainModal] = useState(false);
	const [isCreatingChain, setIsCreatingChain] = useState(false);
	const [pendingAddress, setPendingAddress] = useState<string | null>(null);

	async function createOwnChain(address: string) {
		setIsCreatingChain(true);
		try {
			const result = await createChain(address as string);
			console.log("Chain created:", result);
			setShowChainModal(false);
			setPendingAddress(null);
		} catch (error) {
			console.error("Failed to create chain:", error);
		} finally {
			setIsCreatingChain(false);
		}
	}

	async function fetchUserStatus(address: string) {
		try {
			const response = await checkStatus(address as string);

			if (response.l3Exists) {
				// L3 exists, no action needed
				return;
			} else {
				// L3 doesn't exist, show modal for confirmation
				setPendingAddress(address);
				setShowChainModal(true);
			}
		} catch (error) {
			console.error("Failed to fetch user status:", error);
		}
	}

	function handleConfirmChainCreation() {
		if (pendingAddress) {
			createOwnChain(pendingAddress);
		}
	}

	useEffect(() => {
		if (isConnected && address) {
			fetchUserStatus(address);
		}
	}, [address, isConnected]);

	return {
		showChainModal,
		isCreatingChain,
		handleConfirmChainCreation,
	};
}
