"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { encryptItems, EncryptItem } from "@/lib/apis";
import { isValidEthereumAddress } from "@/lib/common";
import { useContract } from "./useContract";

interface Recipient {
	id: string;
	address: string;
	amount?: string;
	percentage?: string;
}

type DistributionMode = "equal" | "custom" | "percentage";

export const usePaymentForm = () => {
	const { isConnected, address: walletAddress } = useAppKitAccount();
	const { depositAndExec, isReady: isContractReady } = useContract();
	const [totalAmount, setTotalAmount] = useState("");
	const [recipients, setRecipients] = useState<Recipient[]>([
		{ id: "1", address: "" },
		{ id: "2", address: "" },
	]);
	const [mode, setMode] = useState<DistributionMode>("equal");
	const [validationError, setValidationError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isUpdatingRef = useRef(false);
	const prevTotalRef = useRef("");

	const addRecipient = useCallback(() => {
		setRecipients((prev) => [
			...prev,
			{ id: Date.now().toString(), address: "" },
		]);
	}, []);

	const removeRecipient = useCallback((id: string) => {
		setRecipients((prev) => {
			if (prev.length > 1) {
				return prev.filter((r) => r.id !== id);
			}
			return prev;
		});
	}, []);

	const updateRecipient = useCallback(
		(id: string, field: keyof Recipient, value: string) => {
			if (isUpdatingRef.current) return;

			isUpdatingRef.current = true;

			if (mode === "custom" && field === "amount") {
				setRecipients((prev) => {
					const updated = prev.map((r) =>
						r.id === id ? { ...r, [field]: value } : r
					);

					const lastIndex = updated.length - 1;
					const isLastRecipient = updated[lastIndex].id === id;

					if (!isLastRecipient && totalAmount) {
						const total = parseFloat(totalAmount) || 0;
						const sumOfOthers = updated
							.slice(0, -1)
							.reduce((sum, r) => {
								return sum + parseFloat(r.amount || "0");
							}, 0);
						const lastAmount = Math.max(0, total - sumOfOthers);
						updated[lastIndex] = {
							...updated[lastIndex],
							amount: lastAmount.toString(),
						};
					}

					return updated;
				});
			} else if (mode === "percentage" && field === "percentage") {
				setRecipients((prev) => {
					const updated = prev.map((r) =>
						r.id === id ? { ...r, [field]: value } : r
					);

					const lastIndex = updated.length - 1;
					const isLastRecipient = updated[lastIndex].id === id;

					if (!isLastRecipient) {
						const sumOfOthers = updated
							.slice(0, -1)
							.reduce((sum, r) => {
								return sum + parseFloat(r.percentage || "0");
							}, 0);
						const lastPercentage = Math.max(0, 100 - sumOfOthers);
						updated[lastIndex] = {
							...updated[lastIndex],
							percentage: lastPercentage.toString(),
						};
					}

					return updated;
				});
			} else {
				setRecipients((prev) =>
					prev.map((r) =>
						r.id === id ? { ...r, [field]: value } : r
					)
				);
			}

			Promise.resolve().then(() => {
				isUpdatingRef.current = false;
			});
		},
		[mode, totalAmount]
	);

	// Recalculate last recipient when total amount changes in custom mode
	useEffect(() => {
		if (isUpdatingRef.current) return;
		if (mode !== "custom") return;
		if (prevTotalRef.current === totalAmount) return;

		const total = parseFloat(totalAmount) || 0;
		if (total <= 0) {
			prevTotalRef.current = totalAmount;
			return;
		}

		prevTotalRef.current = totalAmount;
		isUpdatingRef.current = true;

		setRecipients((prev) => {
			if (prev.length <= 1) return prev;

			const sumOfOthers = prev.slice(0, -1).reduce((sum, r) => {
				return sum + parseFloat(r.amount || "0");
			}, 0);
			const lastAmount = Math.max(0, total - sumOfOthers);
			const currentLastAmount = parseFloat(
				prev[prev.length - 1].amount || "0"
			);

			if (Math.abs(currentLastAmount - lastAmount) > 0.000001) {
				const updated = [...prev];
				updated[updated.length - 1] = {
					...updated[updated.length - 1],
					amount: lastAmount.toString(),
				};
				return updated;
			}

			return prev;
		});

		Promise.resolve().then(() => {
			isUpdatingRef.current = false;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode, totalAmount]);

	const { distributions, isValid } = useMemo(() => {
		const total = parseFloat(totalAmount) || 0;
		let calculatedDistributions: string[] = [];
		let valid = true;

		if (mode === "equal") {
			calculatedDistributions = recipients.map(() =>
				(total / recipients.length).toString()
			);
		} else if (mode === "percentage") {
			calculatedDistributions = recipients.map((r) => {
				const pct = parseFloat(r.percentage || "0");
				return ((total * pct) / 100).toString();
			});

			if (recipients.length > 1) {
				const sumOfOthers = recipients.slice(0, -1).reduce((sum, r) => {
					return sum + parseFloat(r.percentage || "0");
				}, 0);

				if (sumOfOthers > 100) {
					valid = false;
				}
			}
		} else if (mode === "custom") {
			calculatedDistributions = recipients.map((r) => r.amount || "0");

			const totalCustom = recipients.reduce((sum, r) => {
				return sum + parseFloat(r.amount || "0");
			}, 0);

			if (Math.abs(totalCustom - total) > 0.0001) {
				valid = false;
			}
		} else {
			calculatedDistributions = recipients.map(() => "0");
		}

		const allAddressesValid = recipients.every(
			(r) =>
				r.address.trim() !== "" &&
				isValidEthereumAddress(r.address.trim())
		);
		valid = valid && allAddressesValid && total > 0;

		return { distributions: calculatedDistributions, isValid: valid };
	}, [totalAmount, recipients, mode]);

	// Update validation error message in real-time
	useEffect(() => {
		const total = parseFloat(totalAmount) || 0;

		const hasInvalidAddress = recipients.some(
			(r) => r.address && !isValidEthereumAddress(r.address.trim())
		);
		if (hasInvalidAddress) {
			setValidationError(
				"Please enter valid Ethereum addresses for all recipients"
			);
			return;
		}

		if (total === 0) {
			setValidationError("");
			return;
		}

		if (mode === "custom") {
			const totalCustom = recipients.reduce((sum, r) => {
				return sum + parseFloat(r.amount || "0");
			}, 0);

			if (Math.abs(totalCustom - total) > 0.0001 && totalCustom > 0) {
				const difference = totalCustom - total;
				if (difference > 0) {
					setValidationError(
						`Split amounts exceed total by ${difference.toFixed(
							4
						)} ETH. Total: ${totalCustom.toFixed(
							4
						)} ETH, Expected: ${total} ETH`
					);
				} else {
					setValidationError(
						`Split amounts are ${Math.abs(difference).toFixed(
							4
						)} ETH short. Total: ${totalCustom.toFixed(
							4
						)} ETH, Expected: ${total} ETH`
					);
				}
			} else {
				setValidationError("");
			}
		} else if (mode === "percentage") {
			if (recipients.length > 1) {
				const sumOfOthers = recipients.slice(0, -1).reduce((sum, r) => {
					return sum + parseFloat(r.percentage || "0");
				}, 0);

				if (sumOfOthers > 100) {
					setValidationError(
						`Percentages for first ${
							recipients.length - 1
						} recipient(s) total ${sumOfOthers.toFixed(
							1
						)}%, which exceeds 100%. Please reduce the values.`
					);
				} else {
					setValidationError("");
				}
			} else {
				setValidationError("");
			}
		} else {
			setValidationError("");
		}
	}, [totalAmount, recipients, mode]);

	const handleSend = useCallback(async () => {
		if (!walletAddress) {
			setValidationError("Please connect your wallet first");
			return;
		}

		const total = parseFloat(totalAmount) || 0;

		// Validate all addresses
		const invalidAddresses = recipients.filter(
			(r) => !isValidEthereumAddress(r.address.trim())
		);
		if (invalidAddresses.length > 0) {
			setValidationError(
				`Please enter valid Ethereum addresses for all recipients`
			);
			return;
		}

		if (mode === "custom") {
			const totalCustom = recipients.reduce((sum, r) => {
				return sum + parseFloat(r.amount || "0");
			}, 0);

			if (Math.abs(totalCustom - total) > 0.0001) {
				const difference = totalCustom - total;
				if (difference > 0) {
					setValidationError(
						`Split amounts exceed total by ${difference.toFixed(
							4
						)} ETH`
					);
				} else {
					setValidationError(
						`Split amounts are ${Math.abs(difference).toFixed(
							4
						)} ETH short`
					);
				}
				return;
			}
		} else if (mode === "percentage") {
			if (recipients.length > 1) {
				const sumOfOthers = recipients.slice(0, -1).reduce((sum, r) => {
					return sum + parseFloat(r.percentage || "0");
				}, 0);

				if (sumOfOthers > 100) {
					setValidationError(
						`Percentages for first ${
							recipients.length - 1
						} recipient(s) exceed 100%`
					);
					return;
				}
			}
		}

		setIsSubmitting(true);

		try {
			// Check if contract is ready
			if (!isContractReady) {
				setValidationError(
					"Wallet provider not available. Please reconnect your wallet."
				);
				return;
			}

			// Prepare items for encryption
			const items: EncryptItem[] = recipients.map((r, i) => ({
				recipient: r.address,
				amount: distributions[i],
			}));

			console.log("Sending payment with items:", items);

			// Call encryptItems API
			const response = await encryptItems(walletAddress, items);

			console.log("Encryption response:", response);

			// Check if encryption was successful
			if (
				!response.status ||
				!response.encryptedMessage ||
				!response.l3ChainId
			) {
				throw new Error("Invalid encryption response");
			}

			// Call the contract function with encrypted data
			console.log("Calling depositAndExec on contract...");
			const receipt = await depositAndExec({
				backendDigest: response.encryptedMessage,
				privateChainId: response.l3ChainId,
				totalAmount: totalAmount,
			});

			console.log("Transaction successful!", receipt);
			setValidationError("");

			// Show success message or reset form
			alert("Payment submitted successfully!");
		} catch (error: any) {
			console.error("Error processing payment:", error);

			// Provide user-friendly error messages
			if (error.code === 4001) {
				setValidationError("Transaction rejected by user");
			} else if (error.message?.includes("insufficient funds")) {
				setValidationError(
					"Insufficient funds to complete the transaction"
				);
			} else if (error.message?.includes("encryption")) {
				setValidationError(
					"Failed to encrypt payment data. Please try again."
				);
			} else {
				setValidationError(
					error.message ||
						"Failed to process payment. Please try again."
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	}, [
		walletAddress,
		isContractReady,
		depositAndExec,
		totalAmount,
		recipients,
		distributions,
		mode,
	]);

	return {
		// State
		isConnected,
		totalAmount,
		setTotalAmount,
		recipients,
		mode,
		setMode,
		validationError,
		isSubmitting,
		distributions,
		isValid,
		isValidEthereumAddress,

		// Actions
		addRecipient,
		removeRecipient,
		updateRecipient,
		handleSend,
	};
};
