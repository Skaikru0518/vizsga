"use client";

import { useUser } from "@/hooks";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FormEvent, useState, useEffect } from "react";
import { BookOpen, Loader2 } from "lucide-react";

export default function LoginPage() {
	const router = useRouter();
	const { isAuthenticated, user, login } = useUser();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (isAuthenticated && user) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, user, router]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!username.trim() || !password.trim()) {
			setError("Please enter both username and password");
			return;
		}

		setIsLoading(true);

		try {
			await login({ username, password });
			router.push("/dashboard");
		} catch (err: any) {
			if (err.response?.status === 401) {
				setError("Invalid username or password");
			} else if (err.response?.data?.detail) {
				setError(err.response.data.detail);
			} else {
				setError("Failed to login. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-stone-100 to-amber-100">
			<div className="w-full max-w-md px-6">
				<Card className="bg-white border-stone-200">
					<CardHeader className="text-center">
						<div className="inline-block p-3 bg-amber-100 rounded-full mb-4 mx-auto">
							<BookOpen className="w-8 h-8 text-amber-700" />
						</div>
						<CardTitle className="text-3xl text-stone-800">
							Welcome Back
						</CardTitle>
						<CardDescription className="text-stone-600">
							Sign in to your book collection
						</CardDescription>
					</CardHeader>

					<CardContent>
						{/* Error Message */}
						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-700 text-center">{error}</p>
							</div>
						)}

						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label
									htmlFor="username"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									Username
								</label>
								<Input
									id="username"
									type="text"
									placeholder="Enter your username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									disabled={isLoading}
									className="w-full h-12 px-4 border-stone-300 focus:border-amber-500 focus:ring-amber-500"
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									Password
								</label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isLoading}
									className="w-full h-12 px-4 border-stone-300 focus:border-amber-500 focus:ring-amber-500"
								/>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="btn-primary w-full h-12 text-base font-semibold mt-6"
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Signing in...
									</>
								) : (
									"Sign In"
								)}
							</Button>
						</form>
					</CardContent>

					<CardFooter className="flex-col border-t border-stone-200">
						<p className="text-sm text-stone-600 text-center">
							Don't have an account?{" "}
							<a
								href="/register"
								className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
							>
								Create one
							</a>
						</p>
					</CardFooter>
				</Card>

				{/* Decorative element */}
				<div className="mt-6 text-center">
					<p className="text-xs text-stone-500">
						Secure login powered by your book collection
					</p>
				</div>
			</div>
		</div>
	);
}
