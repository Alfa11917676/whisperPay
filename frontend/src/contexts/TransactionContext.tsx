"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface TransactionContextType {
	isPending: boolean;
	setIsPending: (value: boolean) => void;
	refreshTransaction: () => void;
	triggerRefresh: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
	undefined
);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isPending, setIsPending] = useState(false);
	const [triggerRefresh, setTriggerRefresh] = useState(0);

	const refreshTransaction = useCallback(() => {
		setTriggerRefresh((prev) => prev + 1);
	}, []);

	return (
		<TransactionContext.Provider
			value={{
				isPending,
				setIsPending,
				refreshTransaction,
				triggerRefresh,
			}}
		>
			{children}
		</TransactionContext.Provider>
	);
};

export const useTransaction = () => {
	const context = useContext(TransactionContext);
	if (!context) {
		throw new Error(
			"useTransaction must be used within a TransactionProvider"
		);
	}
	return context;
};
