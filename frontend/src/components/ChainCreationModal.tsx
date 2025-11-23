"use client";

import { Button } from "@/components/ui/Button";
import {
	Modal,
	ModalHeader,
	ModalTitle,
	ModalDescription,
	ModalBody,
	ModalFooter,
} from "@/components/ui/Modal";
import { Rocket, Sparkles } from "lucide-react";
import { useState } from "react";

interface ChainCreationModalProps {
	isOpen: boolean;
	onConfirm: () => void;
	isCreating: boolean;
}

export function ChainCreationModal({
	isOpen,
	onConfirm,
	isCreating,
}: ChainCreationModalProps) {
	return (
		<Modal isOpen={isOpen} allowClose={false}>
			<ModalHeader>
				<div className="flex items-center gap-3 mb-2">
					<div className="p-3 bg-primary/10 rounded-xl">
						<Rocket className="w-6 h-6 text-primary" />
					</div>
					<Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
				</div>
				<ModalTitle>Spin Off Your Chain</ModalTitle>
				<ModalDescription>
					You don't have a Layer 3 chain yet. Create your own
					dedicated chain to start making private transactions with
					WhisperPay.
				</ModalDescription>
			</ModalHeader>

			<ModalBody>
				<div className="space-y-3 text-sm">
					<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
						<div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
						<div>
							<p className="font-medium text-foreground">
								Your Own Private Chain
							</p>
							<p className="text-muted-foreground text-xs mt-1">
								Get a dedicated Layer 3 chain for secure,
								private transactions
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
						<div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
						<div>
							<p className="font-medium text-foreground">
								Enhanced Privacy
							</p>
							<p className="text-muted-foreground text-xs mt-1">
								Your transactions remain confidential and secure
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
						<div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
						<div>
							<p className="font-medium text-foreground">
								Fast Setup
							</p>
							<p className="text-muted-foreground text-xs mt-1">
								Your chain will be ready in just a few moments
							</p>
						</div>
					</div>
				</div>
			</ModalBody>

			<ModalFooter>
				<Button
					onClick={onConfirm}
					disabled={isCreating}
					size="lg"
					className="w-full"
				>
					{isCreating ? (
						<>
							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
							Creating Your Chain...
						</>
					) : (
						<>
							<Rocket className="w-4 h-4 mr-2" />
							Spin Off My Chain
						</>
					)}
				</Button>
			</ModalFooter>
		</Modal>
	);
}
