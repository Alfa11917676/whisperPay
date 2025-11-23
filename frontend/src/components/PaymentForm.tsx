"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
	Plus,
	X,
	Send,
	AlertCircle,
	Wallet,
	Shield,
	Lock,
	CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { usePaymentForm } from "@/hooks/usePaymentForm";
import { useTransaction } from "@/contexts/TransactionContext";

export const PaymentForm = () => {
	const { isPending, refreshTransaction } = useTransaction();
	const {
		// State
		isConnected,
		totalAmount,
		setTotalAmount,
		recipients,
		mode,
		setMode,
		validationError,
		isSubmitting,
		submissionPhase,
		distributions,
		isValid,
		isValidEthereumAddress,

		// Actions
		addRecipient,
		removeRecipient,
		updateRecipient,
		handleSend,
	} = usePaymentForm();

	// Determine button content based on phase
	const getButtonContent = () => {
		if (!isConnected) {
			return (
				<>
					<Wallet className="w-5 h-5" />
					Connect Wallet to Send
				</>
			);
		}

		if (isPending) {
			return (
				<>
					<AlertCircle className="w-5 h-5 animate-pulse" />
					Transaction Pending...
				</>
			);
		}

		switch (submissionPhase) {
			case "securing":
				return (
					<>
						<Shield className="w-5 h-5 animate-pulse" />
						Securing...
					</>
				);
			case "sending":
				return (
					<>
						<Lock className="w-5 h-5 animate-pulse" />
						Sending Anonymous Payment...
					</>
				);
			case "sent":
				return (
					<>
						<CheckCircle2 className="w-5 h-5" />
						Sent
					</>
				);
			default:
				return (
					<>
						<Shield className="w-5 h-5" />
						Secure Your Transaction
					</>
				);
		}
	};

	const isFormDisabled = !isConnected || isPending;

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6">
			<Card className="glass p-8 space-y-6">
				{!isConnected && (
					<div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg text-primary">
						<Wallet className="w-5 h-5 shrink-0" />
						<p className="text-sm">
							Please connect your wallet to start making payments
						</p>
					</div>
				)}
				{isPending && (
					<div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500">
						<AlertCircle className="w-5 h-5 shrink-0 animate-pulse" />
						<p className="text-sm">
							You have a pending transaction. Please wait for it
							to complete before submitting a new payment.
						</p>
					</div>
				)}

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
						disabled={isFormDisabled}
						className="text-2xl h-14 bg-secondary/50 border-border/50 focus:border-primary transition-all"
					/>
					{isFormDisabled ? (
						<p className="text-xs text-muted-foreground">
							{!isConnected
								? "Connect your wallet to enable payment form"
								: "Complete pending transaction to enable form"}
						</p>
					) : !totalAmount ? (
						<p className="text-xs text-muted-foreground">
							Enter the total amount to enable recipient fields
						</p>
					) : null}
				</div>

				<Tabs
					value={mode}
					onValueChange={(v) => setMode(v as typeof mode)}
				>
					<TabsList className="grid w-full grid-cols-3 glass">
						<TabsTrigger
							value="equal"
							disabled={isFormDisabled || !totalAmount}
						>
							Equal
						</TabsTrigger>
						<TabsTrigger
							value="custom"
							disabled={isFormDisabled || !totalAmount}
						>
							Custom
						</TabsTrigger>
						<TabsTrigger
							value="percentage"
							disabled={isFormDisabled || !totalAmount}
						>
							Percentage
						</TabsTrigger>
					</TabsList>

					<TabsContent value="equal" className="space-y-4 mt-6">
						<p className="text-sm text-muted-foreground">
							Amount will be divided equally among all recipients
						</p>
					</TabsContent>

					<TabsContent value="custom" className="space-y-4 mt-6">
						<p className="text-sm text-muted-foreground">
							Specify exact amount for each recipient. The last
							recipient&apos;s amount will be auto-calculated.
						</p>
					</TabsContent>

					<TabsContent value="percentage" className="space-y-4 mt-6">
						<p className="text-sm text-muted-foreground">
							Distribute based on percentage of total. The last
							recipient&apos;s percentage will be auto-calculated
							to sum to 100%.
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
							disabled={isFormDisabled || !totalAmount}
						>
							<Plus className="w-4 h-4" />
							Add
						</Button>
					</div>

					<AnimatePresence initial={false} mode="popLayout">
						{recipients.map((recipient, index) => (
							<motion.div
								key={recipient.id}
								layout
								initial={{
									opacity: 0,
									height: 0,
									marginBottom: 0,
								}}
								animate={{
									opacity: 1,
									height: "auto",
									marginBottom: 16,
								}}
								exit={{
									opacity: 0,
									height: 0,
									marginBottom: 0,
								}}
								transition={{
									duration: 0.2,
									ease: "easeInOut",
								}}
								style={{ overflow: "hidden" }}
							>
								<div className="glass p-4 rounded-lg space-y-3 relative">
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
													disabled={
														isFormDisabled ||
														!totalAmount
													}
													className={`bg-secondary/50 border-border/50 ${
														recipient.address &&
														!isValidEthereumAddress(
															recipient.address.trim()
														)
															? "border-destructive/50 focus-visible:ring-destructive"
															: ""
													}`}
												/>
												{recipient.address &&
													!isValidEthereumAddress(
														recipient.address.trim()
													) && (
														<p className="text-xs text-destructive mt-1">
															Invalid Ethereum
															address
														</p>
													)}
											</div>

											{mode === "custom" && (
												<div>
													<Label className="text-sm text-muted-foreground">
														Amount (ETH){" "}
														{index ===
															recipients.length -
																1 &&
															"(Auto-calculated)"}
													</Label>
													<Input
														type="number"
														step="0.0001"
														placeholder="0.00"
														value={
															recipient.amount ||
															""
														}
														onChange={(e) =>
															updateRecipient(
																recipient.id,
																"amount",
																e.target.value
															)
														}
														disabled={
															isFormDisabled ||
															!totalAmount
														}
														readOnly={
															index ===
															recipients.length -
																1
														}
														className={`bg-secondary/50 border-border/50 ${
															index ===
															recipients.length -
																1
																? "cursor-not-allowed opacity-70"
																: ""
														}`}
													/>
												</div>
											)}

											{mode === "percentage" && (
												<div>
													<Label className="text-sm text-muted-foreground">
														Percentage (%){" "}
														{index ===
															recipients.length -
																1 &&
															"(Auto-calculated)"}
													</Label>
													<Input
														type="number"
														step="1"
														placeholder="0"
														value={
															recipient.percentage ||
															""
														}
														onChange={(e) =>
															updateRecipient(
																recipient.id,
																"percentage",
																e.target.value
															)
														}
														disabled={
															isFormDisabled ||
															!totalAmount
														}
														readOnly={
															index ===
															recipients.length -
																1
														}
														className={`bg-secondary/50 border-border/50 ${
															index ===
															recipients.length -
																1
																? "cursor-not-allowed opacity-70"
																: ""
														}`}
													/>
												</div>
											)}

											<div className="text-sm flex items-center gap-2">
												<span className="text-muted-foreground">
													Will receive:
												</span>
												<span className="text-primary font-semibold">
													{parseFloat(
														distributions[index] ||
															"0"
													).toFixed(6)}{" "}
													ETH
												</span>
											</div>
										</div>

										{recipients.length > 1 && (
											<Button
												onClick={() =>
													removeRecipient(
														recipient.id
													)
												}
												variant="ghost"
												size="icon"
												className="text-muted-foreground hover:text-destructive hover:bg-transparent absolute right-0 top-0"
												disabled={
													isFormDisabled ||
													!totalAmount
												}
											>
												<X className="w-4 h-4" />
											</Button>
										)}
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				<motion.div
					initial={false}
					animate={{
						opacity: validationError ? 1 : 0,
						height: validationError ? "auto" : 0,
						marginBottom: validationError ? 16 : 0,
					}}
					transition={{ duration: 0.2, ease: "easeInOut" }}
					className="overflow-hidden"
				>
					<div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
						<AlertCircle className="w-5 h-5 shrink-0" />
						<p className="text-sm">{validationError || " "}</p>
					</div>
				</motion.div>

				<motion.div
					layout
					transition={{ duration: 0.2, ease: "easeInOut" }}
				>
					<Button
						onClick={handleSend}
						disabled={
							!isConnected ||
							!isValid ||
							isSubmitting ||
							isPending
						}
						className="w-full h-14 text-lg font-display gap-1 glow-primary transition-transform active:scale-[0.98] hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
						size="lg"
					>
						{getButtonContent()}
					</Button>
				</motion.div>
			</Card>
		</div>
	);
};
