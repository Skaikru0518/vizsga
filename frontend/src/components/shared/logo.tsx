export function Logo({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 40 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			{/* Book pages */}
			<path
				d="M8 10C8 8.89543 8.89543 8 10 8H18V32H10C8.89543 32 8 31.1046 8 30V10Z"
				fill="currentColor"
				opacity="0.3"
			/>
			<path
				d="M22 8H30C31.1046 8 32 8.89543 32 10V30C32 31.1046 31.1046 32 30 32H22V8Z"
				fill="currentColor"
				opacity="0.3"
			/>
			{/* Book spine */}
			<rect x="18" y="8" width="4" height="24" fill="currentColor" />
			{/* Bookmark */}
			<path
				d="M25 8V18L27.5 16L30 18V8H25Z"
				fill="currentColor"
				opacity="0.6"
			/>
		</svg>
	);
}
