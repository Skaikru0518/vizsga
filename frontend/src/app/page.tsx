"use client";

import LoginPage from "@/components/auth/login-page";
import { useUser } from "@/hooks";

export default function Home() {
	const { isAuthenticated, user } = useUser();

	if (!isAuthenticated && !user) {
		return <LoginPage />;
	}
}
