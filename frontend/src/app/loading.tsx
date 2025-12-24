"use client";

import { Spinner } from "@/components/shared/spinner";

export default function LoadingPage() {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
			<div className="flex flex-col items-center gap-3">
				<Spinner size="lg" />
				<p className="text-sm text-stone-600 font-medium">Loading...</p>
			</div>
		</div>
	);
}
