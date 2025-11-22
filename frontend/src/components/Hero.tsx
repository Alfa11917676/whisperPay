import { motion } from "framer-motion";
import { Shield, Lock, Zap } from "lucide-react";

export const Hero = () => {
	return (
		<div className="relative overflow-hidden py-20">
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="text-center space-y-6 max-w-4xl mx-auto"
			>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
					className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4"
				>
					<Shield className="w-4 h-4 text-primary" />
					<span className="text-sm font-medium">
						Privacy-First Payment Protocol
					</span>
				</motion.div>

				<h1 className="text-6xl md:text-7xl font-display font-bold leading-tight">
					<span className="text-glow">Anonymous</span>
					<br />
					<span className="text-foreground">
						Payment Distribution
					</span>
				</h1>

				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Distribute funds to multiple recipients without exposing
					your wallet address. Powered by L2/L3 architecture for
					maximum privacy.
				</p>

				<div className="flex flex-wrap items-center justify-center gap-8 pt-8">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center gap-3 glass px-6 py-3 rounded-xl"
					>
						<Lock className="w-5 h-5 text-primary" />
						<span className="font-medium">Burner Wallets</span>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center gap-3 glass px-6 py-3 rounded-xl"
					>
						<Shield className="w-5 h-5 text-accent" />
						<span className="font-medium">L3 Anonymization</span>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center gap-3 glass px-6 py-3 rounded-xl"
					>
						<Zap className="w-5 h-5 text-primary" />
						<span className="font-medium">
							Instant Distribution
						</span>
					</motion.div>
				</div>
			</motion.div>

			{/* Animated background elements */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.1, 0.15, 0.1],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.1, 0.2, 0.1],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 2,
					}}
					className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
				/>
			</div>
		</div>
	);
};
