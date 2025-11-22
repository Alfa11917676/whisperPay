"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Send, AlertCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { usePaymentForm } from "@/hooks/usePaymentForm";

export const PaymentForm = () => {
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
		distributions,
		isValid,
		isValidEthereumAddress,

		// Actions
		addRecipient,
		removeRecipient,
		updateRecipient,
		handleSend,
	} = usePaymentForm();

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
						disabled={!isConnected}
						className="text-2xl h-14 bg-secondary/50 border-border/50 focus:border-primary transition-all"
					/>
					{!isConnected ? (
						<p className="text-xs text-muted-foreground">
							Connect your wallet to enable payment form
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
							disabled={!isConnected || !totalAmount}
						>
							Equal
						</TabsTrigger>
						<TabsTrigger
							value="custom"
							disabled={!isConnected || !totalAmount}
						>
							Custom
						</TabsTrigger>
						<TabsTrigger
							value="percentage"
							disabled={!isConnected || !totalAmount}
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
							disabled={!isConnected || !totalAmount}
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
								<div className="glass p-4 rounded-lg space-y-3">
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
														!isConnected ||
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
															!isConnected ||
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
															!isConnected ||
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
												className="text-muted-foreground hover:text-destructive"
												disabled={
													!isConnected || !totalAmount
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
						disabled={!isConnected || !isValid || isSubmitting}
						className="w-full h-14 text-lg font-display gap-3 glow-primary transition-transform active:scale-[0.98] hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
						size="lg"
					>
						<Send className="w-5 h-5" />
						{isSubmitting
							? "Processing..."
							: !isConnected
							? "Connect Wallet to Send"
							: "Send Anonymous Payment"}
					</Button>
				</motion.div>
			</Card>
		</div>
	);
};
