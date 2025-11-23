"use client";

import { useApp } from "@/hooks/useApp";
import { ChainCreationModal } from "@/components/ChainCreationModal";
import { atom } from "jotai";

export function AppState({ children }: { children?: React.ReactNode }) {
	const { showChainModal, isCreatingChain, handleConfirmChainCreation } =
		useApp();

	return (
		<>
			{children}
			<ChainCreationModal
				isOpen={showChainModal}
				onConfirm={handleConfirmChainCreation}
				isCreating={isCreatingChain}
			/>
		</>
	);
}
