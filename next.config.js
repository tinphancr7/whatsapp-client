/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["www.google.com", "lh3.googleusercontent.com", "localhost"],
	},
	env: {
		NEXT_PUBLIC_ZEGO_APP_ID: 74785381,
		NEXT_PUBLIC_ZEGO_SERVER_ID: "ca6498a22de9effabad21f1e2167601f",
	},
};

module.exports = nextConfig;
