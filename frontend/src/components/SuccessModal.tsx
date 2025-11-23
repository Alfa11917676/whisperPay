"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
	Modal,
	ModalHeader,
	ModalTitle,
	ModalDescription,
	ModalBody,
	ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} allowClose={true}>
			<div className="text-center">
				<ModalHeader className="flex flex-col items-center">
					{/* Animated Success Icon */}
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							type: "spring",
							stiffness: 200,
							damping: 15,
						}}
						className="relative mb-4"
					>
						<motion.div
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.5, 0.8, 0.5],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
						/>
						<div className="relative bg-gradient-to-br from-accent/20 to-primary/20 rounded-full p-6 glow-accent">
							<CheckCircle2 className="w-16 h-16 text-accent" />
						</div>
					</motion.div>

					<ModalTitle className="text-3xl font-display bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
						Payment Secured!
					</ModalTitle>
					<ModalDescription className="text-base mt-3">
						Your anonymous payment has been successfully submitted
						and encrypted.
					</ModalDescription>
				</ModalHeader>

				<ModalBody>
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="glass rounded-lg p-6 space-y-4"
					>
						<div className="flex items-start gap-3">
							<div className="bg-primary/10 rounded-full p-2 mt-0.5">
								<Sparkles className="w-5 h-5 text-primary" />
							</div>
							<div className="text-left flex-1">
								<h4 className="font-semibold text-foreground mb-1">
									Transaction Processing
								</h4>
								<p className="text-sm text-muted-foreground">
									Your payment is being processed securely on
									the blockchain. You can track its status in
									the transaction panel below.
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="bg-accent/10 rounded-full p-2 mt-0.5">
								<CheckCircle2 className="w-5 h-5 text-accent" />
							</div>
							<div className="text-left flex-1">
								<h4 className="font-semibold text-foreground mb-1">
									Privacy Protected
								</h4>
								<p className="text-sm text-muted-foreground">
									All recipient information has been encrypted
									and secured using advanced privacy
									technology.
								</p>
							</div>
						</div>
					</motion.div>
				</ModalBody>

				<ModalFooter className="justify-center">
					<Button
						onClick={onClose}
						className="w-full sm:w-auto px-8 glow-primary"
						size="lg"
					>
						Got it!
					</Button>
				</ModalFooter>
			</div>
		</Modal>
	);
}
