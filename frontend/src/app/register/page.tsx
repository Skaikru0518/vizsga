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
import { RegisterDto } from "@/interface";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
	const [registerForm, setRegisterForm] = useState<RegisterDto>({
		email: "",
		username: "",
		password: "",
		first_name: "",
		last_name: "",
	});
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = (e: any) => {
		e.preventDefault();
		console.log(registerForm);
	};
	return (
		<div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-stone-100 to-amber-100">
			<div className="w-full max-w-lg px-6">
				<Card className="bg-white border-stone-200">
					<CardHeader className="text-center">
						<div className="inline-block p-3 bg-amber-100 rounded-full mb-4 mx-auto">
							<BookOpen className="w-8 h-8 text-amber-700" />
						</div>
						<CardTitle className="text-3xl text-stone-800">
							Join Our Library
						</CardTitle>
						<CardDescription className="text-stone-600">
							Create an account to start your book collection
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
							{/* First Row: First Name & Last Name */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label
										htmlFor="firstName"
										className="block text-sm font-medium text-stone-700 mb-2"
									>
										First Name
									</Label>
									<Input
										id="firstName"
										type="text"
										placeholder="First name"
										onChange={(e) =>
											setRegisterForm({
												...registerForm,
												first_name: e.target.value,
											})
										}
										disabled={isLoading}
										className="w-full h-12 px-4 border-stone-300 focus:border-amber-500 focus:ring-amber-500"
									/>
								</div>

								<div>
									<Label
										htmlFor="lastName"
										className="block text-sm font-medium text-stone-700 mb-2"
									>
										Last Name
									</Label>
									<Input
										id="lastName"
										type="text"
										placeholder="Last name"
										onChange={(e) =>
											setRegisterForm({
												...registerForm,
												last_name: e.target.value,
											})
										}
										disabled={isLoading}
										className="w-full h-12 px-4 border-stone-300 focus:border-amber-500 focus:ring-amber-500"
									/>
								</div>
							</div>

							{/* Second Row: Username & Email */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label
										htmlFor="username"
										className="block text-sm font-medium text-stone-700 mb-2"
									>
										Username
									</Label>
									<Input
										id="username"
										type="text"
										placeholder="Username"
										onChange={(e) =>
											setRegisterForm({
												...registerForm,
												username: e.target.value,
											})
										}
										disabled={isLoading}
										className="w-full h-12 px-4 border-stone-300 focus:border-amber-500 focus:ring-amber-500"
									/>
								</div>

								<div>
									<Label
										htmlFor="email"
										className="block text-sm font-medium text-stone-700 mb-2"
									>
										Email
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="Email"
										onChange={(e) =>
											setRegisterForm({
												...registerForm,
												email: e.target.value,
											})
										}
										disabled={isLoading}
										className="w-full h-12 px-4 border-stone-300 focus:border-amber-500 focus:ring-amber-500"
									/>
								</div>
							</div>

							{/* Third Row: Password */}
							<div>
								<Label
									htmlFor="password"
									className="block text-sm font-medium text-stone-700 mb-2"
								>
									Password
								</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									onChange={(e) =>
										setRegisterForm({
											...registerForm,
											password: e.target.value,
										})
									}
									disabled={isLoading}
									className="w-full h-12 px-4 border-stone-300 focus:border-amber-500 focus:ring-amber-500"
								/>
							</div>

							{/* Fourth Row: Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="btn-primary w-full h-12 text-base font-semibold mt-6"
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Creating account
									</>
								) : (
									"Create Account"
								)}
							</Button>
						</form>
					</CardContent>

					<CardFooter className="flex-col border-t border-stone-200">
						<p className="text-sm text-stone-600 text-center">
							Have an account?{" "}
							<Link
								href="/login"
								className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
							>
								Login here
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
