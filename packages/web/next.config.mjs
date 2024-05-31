/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["webpart"],
  rewrites: async () => {
    return [
        {
            source: "/((?!api).*)",
            destination: "/",
        },
    ];
  },
};

export default nextConfig;
