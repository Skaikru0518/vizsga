"use client";

import {
	AuthContextType,
	AuthProviderProps,
	LoginDto,
	User,
} from "@/interface";
import { authApi } from "@/lib/api-routes";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// load user from localstorage
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		const accessToken = localStorage.getItem("access");

		if (storedUser && accessToken) {
			try {
				setUser(JSON.parse(storedUser));
				setIsAuthenticated(true);
			} catch (error: any) {
				console.error("Failed to parse stored user:", error);
				localStorage.removeItem("user");
				localStorage.removeItem("access");
				localStorage.removeItem("refresh");
			}
		}
		setIsLoading(false);
	}, []);

	const login = async (creds: LoginDto) => {
		try {
			const response = await authApi.login(creds);
			const { access, refresh, user: userData } = response.data;

			// store token and user data
			localStorage.setItem("access", access);
			localStorage.setItem("refresh", refresh);
			localStorage.setItem("user", JSON.stringify(userData));

			setIsAuthenticated(true);
			setUser(userData);
		} catch (error) {
			console.error("Login failed", error);
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		localStorage.removeItem("user");

		setIsAuthenticated(false);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, login, logout, isLoading, isAuthenticated }}
		>
			{children}
		</AuthContext.Provider>
	);
}
