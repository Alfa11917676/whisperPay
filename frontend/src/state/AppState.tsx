import { useApp } from "@/hooks/useApp";
import { atom } from "jotai";

export function AppState({ children }: { children?: React.ReactNode }) {
	useApp();

	return children;
}
