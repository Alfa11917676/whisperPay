"use client";

import { WalletConnect } from "@/components/WalletConnect";
import { Hero } from "@/components/Hero";
import { PrivacyFlow } from "@/components/PrivacyFlow";
import { PaymentForm } from "@/components/PaymentForm";
import { TransactionStatus } from "@/components/TransactionStatus";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { motion } from "framer-motion";
import Image from "next/image";

const Index = () => {
	return (
		<TransactionProvider>
			<main className="min-h-screen">
				{/* Header */}
				<motion.header
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="container mx-auto px-4 py-6"
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Image
								src="/images/logo.png"
								alt="WhisperPay Logo"
								width={40}
								height={40}
								className="w-10 h-10"
							/>
							<h1 className="text-2xl font-display font-bold">
								WhisperPay
							</h1>
						</div>
						<WalletConnect />
					</div>
				</motion.header>

				{/* Main Content */}
				<main className="container mx-auto px-4 space-y-16 pb-20">
					<Hero />
					<PrivacyFlow />
					<TransactionStatus />
					<PaymentForm />
				</main>

				{/* Footer */}
				<footer className="container mx-auto px-4 py-8 flex flex-col gap-10 text-center text-sm text-muted-foreground border-t border-border/50">
					<div className="flex items-center justify-between">
						<p>Built for privacy. Powered by L2/L3 architecture.</p>
						<p className="mt-2">Made with ❤️ by De0xys</p>
					</div>
					<p className="mt-2">
						© {new Date().getFullYear()} WhisperPay. All rights
						reserved.
					</p>
				</footer>
			</main>
		</TransactionProvider>
	);
};

export default Index;
