"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-stone-100 to-amber-100 p-4">
			<Card className="max-w-md w-full bg-white border-stone-200">
				<CardHeader className="text-center">
					<div className="inline-block p-3 bg-amber-100 rounded-full mb-4 mx-auto">
						<FileQuestion className="w-8 h-8 text-amber-700" />
					</div>
					<CardTitle className="text-2xl text-stone-800">
						Page Not Found
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-stone-600 mb-4">
						The page you're looking for doesn't exist or has been moved.
					</p>
					<div className="text-6xl font-bold text-amber-700 mb-4">404</div>
				</CardContent>
				<CardFooter className="flex gap-3 justify-center">
					<Button asChild className="bg-amber-700 hover:bg-amber-800">
						<Link href="/">Go home</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/browse">Browse books</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
