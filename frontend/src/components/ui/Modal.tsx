import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModalProps {
	isOpen: boolean;
	onClose?: () => void;
	children: React.ReactNode;
	className?: string;
	allowClose?: boolean;
}

export function Modal({
	isOpen,
	onClose,
	children,
	className,
	allowClose = true,
}: ModalProps) {
	React.useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget && allowClose && onClose) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
						onClick={handleBackdropClick}
					/>

					{/* Modal Content */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ duration: 0.2 }}
							className={cn(
								"relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 shadow-2xl p-6",
								className
							)}
						>
							{children}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}

export function ModalHeader({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={cn("mb-4", className)}>{children}</div>;
}

export function ModalTitle({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<h2 className={cn("text-2xl font-bold text-foreground", className)}>
			{children}
		</h2>
	);
}

export function ModalDescription({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<p className={cn("text-sm text-muted-foreground mt-2", className)}>
			{children}
		</p>
	);
}

export function ModalBody({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={cn("py-4", className)}>{children}</div>;
}

export function ModalFooter({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex gap-3 justify-end mt-6", className)}>
			{children}
		</div>
	);
}
