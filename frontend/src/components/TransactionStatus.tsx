"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useContract } from "@/hooks/useContract";
import { useTransaction } from "@/contexts/TransactionContext";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/Card";
import { formatEther } from "ethers-v6";

interface JobDetails {
	status: bigint;
	digest: string;
	value: bigint;
}

const statusConfig: Record<
	string,
	{
		label: string;
		icon: any;
		color: string;
		bgColor: string;
		borderColor: string;
	}
> = {
	"1": {
		label: "Pending",
		icon: Clock,
		color: "text-yellow-500",
		bgColor: "bg-yellow-500/10",
		borderColor: "border-yellow-500/20",
	},
	"2": {
		label: "Done",
		icon: CheckCircle2,
		color: "text-green-500",
		bgColor: "bg-green-500/10",
		borderColor: "border-green-500/20",
	},
	"3": {
		label: "Failed",
		icon: XCircle,
		color: "text-red-500",
		bgColor: "bg-red-500/10",
		borderColor: "border-red-500/20",
	},
};

export const TransactionStatus = () => {
	const { address, isConnected } = useAppKitAccount();
	const { getJobDetails, isReady } = useContract();
	const { setIsPending, triggerRefresh } = useTransaction();
	const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const fetchJobDetailsRef = useRef<(() => Promise<void>) | undefined>(
		undefined
	);
	const isInitialFetchRef = useRef(true);

	const fetchJobDetails = useCallback(async () => {
		if (!isConnected || !address || !isReady) {
			setJobDetails(null);
			setIsPending(false);
			return;
		}

		// Only show loading on initial fetch, not during polling
		if (isInitialFetchRef.current) {
			setLoading(true);
		}
		setError(null);

		try {
			const details = await getJobDetails(address);
			console.log("Job details fetched:", details);

			// Convert the Result array to our interface
			const jobData: JobDetails = {
				status: details[0],
				digest: details[1],
				value: details[2],
			};

			// Only set job details if there's a valid transaction
			// (status > 0 or value > 0)
			if (jobData.status > BigInt(0) || jobData.value > BigInt(0)) {
				setJobDetails(jobData);

				// Update pending state in context
				const isPending = jobData.status === BigInt(1);
				setIsPending(isPending);

				// Set up polling if status is pending
				if (isPending) {
					if (!pollingIntervalRef.current) {
						pollingIntervalRef.current = setInterval(() => {
							fetchJobDetailsRef.current?.();
						}, 5000);
					}
				} else {
					// Clear polling if status is not pending
					if (pollingIntervalRef.current) {
						clearInterval(pollingIntervalRef.current);
						pollingIntervalRef.current = null;
					}
				}
			} else {
				setJobDetails(null);
				setIsPending(false);
				// Clear polling if no transaction
				if (pollingIntervalRef.current) {
					clearInterval(pollingIntervalRef.current);
					pollingIntervalRef.current = null;
				}
			}
		} catch (err) {
			console.error("Error fetching job details:", err);
			// Don't show error for empty transactions
			setJobDetails(null);
			setIsPending(false);
		} finally {
			if (isInitialFetchRef.current) {
				setLoading(false);
				isInitialFetchRef.current = false;
			}
		}
	}, [isConnected, address, isReady, getJobDetails, setIsPending]);

	// Keep the ref updated with the latest function
	useEffect(() => {
		fetchJobDetailsRef.current = fetchJobDetails;
	}, [fetchJobDetails]);

	useEffect(() => {
		// Reset initial fetch flag when address or connection changes
		isInitialFetchRef.current = true;

		fetchJobDetails();

		// Cleanup polling on unmount
		return () => {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
				pollingIntervalRef.current = null;
			}
		};
	}, [fetchJobDetails, triggerRefresh]);

	if (!isConnected) {
		return null;
	}

	if (loading) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-2xl mx-auto"
			>
				<Card>
					<CardContent className="flex items-center justify-center py-12">
						<Loader2 className="w-6 h-6 animate-spin text-primary" />
						<span className="ml-3 text-muted-foreground">
							Loading transaction details...
						</span>
					</CardContent>
				</Card>
			</motion.div>
		);
	}

	if (error) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-2xl mx-auto"
			>
				<Card className="border-red-500/20">
					<CardContent className="py-6">
						<div className="flex items-center gap-3 text-red-500">
							<XCircle className="w-5 h-5" />
							<span>{error}</span>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		);
	}

	if (!jobDetails) {
		return null;
	}

	const status = statusConfig[jobDetails.status.toString()];
	const StatusIcon = status?.icon || Clock;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full max-w-2xl mx-auto"
		>
			<Card className={status?.borderColor}>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-2xl">
								Latest Transaction
							</CardTitle>
							<CardDescription className="mt-2">
								Your most recent payment job status
							</CardDescription>
						</div>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring" }}
							className={`flex items-center gap-2 px-4 py-2 rounded-full ${status?.bgColor} ${status?.borderColor} border`}
						>
							<StatusIcon
								className={`w-4 h-4 ${status?.color}`}
							/>
							<span
								className={`text-sm font-semibold ${status?.color}`}
							>
								{status?.label || "Unknown"}
							</span>
						</motion.div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<div className="glass p-4 rounded-xl">
							<div className="text-sm text-muted-foreground mb-1">
								Transaction Digest
							</div>
							<div className="font-mono text-sm break-all">
								{jobDetails.digest}
							</div>
						</div>

						<div className="glass p-4 rounded-xl">
							<div className="text-sm text-muted-foreground mb-1">
								Amount
							</div>
							<div className="text-2xl font-bold">
								{formatEther(jobDetails.value)} ETH
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};
