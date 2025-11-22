"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";

interface Recipient {
	id: string;
	address: string;
	amount?: string;
	percentage?: string;
}

type DistributionMode = "equal" | "custom" | "percentage" | "ratio";

export const PaymentForm = () => {
	const [totalAmount, setTotalAmount] = useState("");
	const [recipients, setRecipients] = useState<Recipient[]>([
		{ id: "1", address: "" },
	]);
	const [mode, setMode] = useState<DistributionMode>("equal");

	const addRecipient = () => {
		setRecipients([
			...recipients,
			{ id: Date.now().toString(), address: "" },
		]);
	};

	const removeRecipient = (id: string) => {
		if (recipients.length > 1) {
			setRecipients(recipients.filter((r) => r.id !== id));
		}
	};

	const updateRecipient = (
		id: string,
		field: keyof Recipient,
		value: string
	) => {
		setRecipients(
			recipients.map((r) => (r.id === id ? { ...r, [field]: value } : r))
		);
	};

	const calculateDistribution = () => {
		const total = parseFloat(totalAmount) || 0;
		if (mode === "equal") {
			return recipients.map(() => (total / recipients.length).toFixed(4));
		}
		if (mode === "percentage") {
			return recipients.map((r) => {
				const pct = parseFloat(r.percentage || "0");
				return ((total * pct) / 100).toFixed(4);
			});
		}
		if (mode === "custom") {
			return recipients.map((r) => r.amount || "0");
		}
		// ratio mode
		const totalRatio = recipients.reduce(
			(sum, r) => sum + parseFloat(r.amount || "1"),
			0
		);
		return recipients.map((r) => {
			const ratio = parseFloat(r.amount || "1");
			return ((total * ratio) / totalRatio).toFixed(4);
		});
	};

	const distributions = calculateDistribution();

	const handleSend = () => {
		// TODO: Implement actual transaction logic
		console.log("Sending payment...", {
			totalAmount,
			recipients: recipients.map((r, i) => ({
				address: r.address,
				amount: distributions[i],
			})),
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-full max-w-4xl mx-auto space-y-6"
		>
			<Card className="glass p-8 space-y-6">
				<div className="space-y-2">
					<Label
						htmlFor="total-amount"
						className="text-lg font-display"
					>
						Total Amount (ETH)
					</Label>
					<Input
						id="total-amount"
						type="number"
						step="0.0001"
						placeholder="0.00"
						value={totalAmount}
						onChange={(e) => setTotalAmount(e.target.value)}
						className="text-2xl h-14 bg-secondary/50 border-border/50 focus:border-primary transition-all"
					/>
				</div>

				<Tabs
					value={mode}
					onValueChange={(v) => setMode(v as DistributionMode)}
				>
					<TabsList className="grid w-full grid-cols-4 glass">
						<TabsTrigger value="equal">Equal</TabsTrigger>
						<TabsTrigger value="custom">Custom</TabsTrigger>
						<TabsTrigger value="percentage">Percentage</TabsTrigger>
						<TabsTrigger value="ratio">Ratio</TabsTrigger>
					</TabsList>

					<TabsContent value="equal" className="space-y-4 mt-6">
						<p className="text-sm text-muted-foreground">
							Amount will be divided equally among all recipients
						</p>
					</TabsContent>

					<TabsContent value="custom" className="space-y-4 mt-6">
						<p className="text-sm text-muted-foreground">
							Specify exact amount for each recipient
						</p>
					</TabsContent>

					<TabsContent value="percentage" className="space-y-4 mt-6">
						<p className="text-sm text-muted-foreground">
							Distribute based on percentage of total
						</p>
					</TabsContent>

					<TabsContent value="ratio" className="space-y-4 mt-6">
						<p className="text-sm text-muted-foreground">
							Distribute based on ratio values
						</p>
					</TabsContent>
				</Tabs>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Label className="text-lg font-display">
							Recipients
						</Label>
						<Button
							onClick={addRecipient}
							variant="outline"
							size="sm"
							className="gap-2"
						>
							<Plus className="w-4 h-4" />
							Add
						</Button>
					</div>

					<AnimatePresence mode="popLayout">
						{recipients.map((recipient, index) => (
							<motion.div
								key={recipient.id}
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="glass p-4 rounded-lg space-y-3"
							>
								<div className="flex items-start gap-3">
									<div className="flex-1 space-y-3">
										<div>
											<Label className="text-sm text-muted-foreground">
												Address {index + 1}
											</Label>
											<Input
												placeholder="0x..."
												value={recipient.address}
												onChange={(e) =>
													updateRecipient(
														recipient.id,
														"address",
														e.target.value
													)
												}
												className="bg-secondary/50 border-border/50"
											/>
										</div>

										{mode === "custom" && (
											<div>
												<Label className="text-sm text-muted-foreground">
													Amount (ETH)
												</Label>
												<Input
													type="number"
													step="0.0001"
													placeholder="0.00"
													value={recipient.amount}
													onChange={(e) =>
														updateRecipient(
															recipient.id,
															"amount",
															e.target.value
														)
													}
													className="bg-secondary/50 border-border/50"
												/>
											</div>
										)}

										{mode === "percentage" && (
											<div>
												<Label className="text-sm text-muted-foreground">
													Percentage (%)
												</Label>
												<Input
													type="number"
													step="1"
													placeholder="0"
													value={recipient.percentage}
													onChange={(e) =>
														updateRecipient(
															recipient.id,
															"percentage",
															e.target.value
														)
													}
													className="bg-secondary/50 border-border/50"
												/>
											</div>
										)}

										{mode === "ratio" && (
											<div>
												<Label className="text-sm text-muted-foreground">
													Ratio
												</Label>
												<Input
													type="number"
													step="1"
													placeholder="1"
													value={recipient.amount}
													onChange={(e) =>
														updateRecipient(
															recipient.id,
															"amount",
															e.target.value
														)
													}
													className="bg-secondary/50 border-border/50"
												/>
											</div>
										)}

										<div className="text-sm flex items-center gap-2">
											<span className="text-muted-foreground">
												Will receive:
											</span>
											<span className="text-primary font-semibold">
												{distributions[index]} ETH
											</span>
										</div>
									</div>

									{recipients.length > 1 && (
										<Button
											onClick={() =>
												removeRecipient(recipient.id)
											}
											variant="ghost"
											size="icon"
											className="text-muted-foreground hover:text-destructive"
										>
											<X className="w-4 h-4" />
										</Button>
									)}
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				<motion.div
					whileHover={{ scale: 1.01 }}
					whileTap={{ scale: 0.99 }}
				>
					<Button
						onClick={handleSend}
						className="w-full h-14 text-lg font-display gap-3 glow-primary"
						size="lg"
					>
						<Send className="w-5 h-5" />
						Send Anonymous Payment
					</Button>
				</motion.div>
			</Card>
		</motion.div>
	);
};
