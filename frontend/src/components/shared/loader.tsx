import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
	fullscreen?: boolean;
	size?: "sm" | "md" | "lg";
	message?: string;
	className?: string;
}

export function Loader({
	fullscreen = false,
	size = "md",
	message,
	className,
}: LoaderProps) {
	const sizeClasses = {
		sm: "w-6 h-6",
		md: "w-10 h-10",
		lg: "w-16 h-16",
	};

	const spinner = (
		<div className={cn("flex flex-col items-center gap-3", className)}>
			<Loader2
				className={cn(
					"animate-spin text-amber-700",
					sizeClasses[size]
				)}
			/>
			{message && (
				<p className="text-sm text-stone-600 font-medium">{message}</p>
			)}
		</div>
	);

	if (fullscreen) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
				{spinner}
			</div>
		);
	}

	return spinner;
}
