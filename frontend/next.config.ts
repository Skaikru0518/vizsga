import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "covers.openlibrary.org",
				pathname: "/b/**",
			},
			{
				protocol: "https",
				hostname: "epub.us",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
