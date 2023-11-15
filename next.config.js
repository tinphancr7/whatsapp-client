/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["www.google.com", "lh3.googleusercontent.com", "localhost"],
	},
	env: {
		NEXT_PUBLIC_ZEGO_APP_ID: 712659714,
		NEXT_PUBLIC_ZEGO_SERVER_ID: "b65af45cc4f7c593df5395abfd1508fb",
	},
};

module.exports = nextConfig;
