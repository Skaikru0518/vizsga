import { useUser } from "@/hooks";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function LoginPage() {
	const router = useRouter();
	const { isAuthenticated, user } = useUser();

	if (isAuthenticated && user) {
		router.push("/dashboard");
	}

	return (
		<div>
			<Input placeholder="Username..." />
			<Input placeholder="Password..." />
		</div>
	);
}
