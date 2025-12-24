"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-stone-100 to-amber-100 p-4">
			<Card className="max-w-md w-full bg-white border-stone-200">
				<CardHeader className="text-center">
					<div className="inline-block p-3 bg-red-100 rounded-full mb-4 mx-auto">
						<AlertCircle className="w-8 h-8 text-red-600" />
					</div>
					<CardTitle className="text-2xl text-stone-800">
						Something went wrong!
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-stone-600 mb-4">
						We encountered an unexpected error. Please try again.
					</p>
					{error.message && (
						<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-700 font-mono wrap-break-word">
								{error.message}
							</p>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex gap-3 justify-center">
					<Button
						onClick={reset}
						className="bg-amber-700 hover:bg-amber-800"
					>
						Try again
					</Button>
					<Button
						variant="outline"
						onClick={() => (window.location.href = "/")}
					>
						Go home
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
