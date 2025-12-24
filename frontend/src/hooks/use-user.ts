import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { AuthContextType } from "@/interface";

export function useUser(): AuthContextType {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useUser must be used within an AuthProvider");
	}

	return context;
}
