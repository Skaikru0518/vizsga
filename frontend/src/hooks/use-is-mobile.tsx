"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if the user is on a mobile device
 * @param breakpoint - The breakpoint in pixels (default: 768)
 * @returns boolean - true if screen width is less than breakpoint
 */
export function useIsMobile(breakpoint: number = 768): boolean {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		// Check if window is defined (for SSR)
		if (typeof window === "undefined") return;

		// Initial check
		const checkMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		// Set initial value
		checkMobile();

		// Add event listener for window resize
		window.addEventListener("resize", checkMobile);

		// Cleanup
		return () => window.removeEventListener("resize", checkMobile);
	}, [breakpoint]);

	return isMobile;
}
