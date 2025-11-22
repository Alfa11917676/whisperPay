import { motion } from "framer-motion";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { truncateAddress } from "@/lib/common";
import { Wallet } from "lucide-react";

export const WalletConnect = () => {
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();

	return (
		<motion.button
			onClick={() => open()}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold text-lg hover:glow-primary transition-all duration-300"
		>
			{isConnected && address ? (
				<div className="flex items-center gap-1">
					<Wallet />
					<span>{truncateAddress(address)}</span>
				</div>
			) : (
				"Connect Wallet"
			)}
		</motion.button>
	);
};
