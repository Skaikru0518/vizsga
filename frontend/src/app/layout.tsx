import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import LoadingPage from "./loading";
import { AuthProvider } from "@/context/auth-context";
import Navbar from "@/components/shared/navbar";

const interSans = Inter({
	variable: "--font-inter-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ReadList - Track Your Reading Journey",
	description:
		"A modern book tracking application to manage your reading list, mark books as read, and organize your personal library.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${interSans.variable} antialiased bg-linear-to-br from-amber-50 via-stone-100 to-amber-100 min-h-screen`}
			>
				<AuthProvider>
					<Suspense fallback={<LoadingPage />}>
						<Navbar />
						{children}
					</Suspense>
				</AuthProvider>
			</body>
		</html>
	);
}
