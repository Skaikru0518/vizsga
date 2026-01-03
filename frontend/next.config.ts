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
			{
				protocol: "http",
				hostname: "localhost",
				port: "8000",
				pathname: "/media/**",
			},
		],
	},
};

export default nextConfig;
