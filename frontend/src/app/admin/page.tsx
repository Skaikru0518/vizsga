"use client";
import { useUser } from "@/hooks";
import { useRouter } from "next/navigation";

export default function AdminPage() {
	const router = useRouter();
	const { user } = useUser();

	if (!user?.is_superuser || !user) {
		router.push("/");
	}
	return <div>AdminPage</div>;
}
