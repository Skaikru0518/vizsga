"use client";

import LoginPage from "@/components/auth/login-page";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks";

export default function Home() {
	const { isAuthenticated, user } = useUser();
	const router = useRouter();

	if (!isAuthenticated && !user) {
		router.push("/login");
	}
}
