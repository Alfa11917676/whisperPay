"use client";
import { Provider } from "jotai";
import { AppState } from "./AppState";

export default function StateProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Provider>
			<AppState>{children}</AppState>
		</Provider>
	);
}
