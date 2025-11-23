import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "@/components/WalletProvider";
import { Inter, Space_Grotesk } from "next/font/google";
import StateProvider from "@/state/StateProvider";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-display",
});

export const metadata: Metadata = {
	title: "Whisper Pay",
	description:
		"Secure, anonymous fund distribution across L2 and L3 chains. Leverage our private contract routing system (Arbitrum/Orbit) for decentralized, untraceable payments to your recipients. Privacy-focused cryptocurrency payments simplified.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`antialiased ${inter.variable} ${spaceGrotesk.variable}`}
			>
				<WalletProvider>
					<StateProvider>{children} </StateProvider>
				</WalletProvider>
			</body>
		</html>
	);
}
