"use client";

import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { arbitrumSepolia } from "@reown/appkit/networks";

// 1. Get projectId at https://cloud.reown.com
const projectId = "ee1621642d6d8c3b5fc509b2316773f2";

// 2. Create a metadata object
const metadata = {
	name: "WhisperPay",
	description:
		"WhisperPay is a privacy-focused payment protocol that allows you to distribute funds to multiple recipients without exposing your wallet address.",
	url: "https://whisperpay.com",
	icons: ["/images/logo.png"],
};

// 3. Create the AppKit instance
createAppKit({
	adapters: [new Ethers5Adapter()],
	metadata,
	networks: [arbitrumSepolia],
	projectId,
	features: {
		analytics: true,
		socials: [
			"google",
			"x",
			"github",
			"discord",
			"apple",
			"facebook",
			"farcaster",
		],
		onramp: false,
		email: true,
		swaps: false,
	},
});

export const APP_CHAIN_ID = arbitrumSepolia.id;

export default function WalletProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
