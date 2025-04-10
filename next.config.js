/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  api: {
    externalResolver: true,
  },
  env: {
    NETWORK_MODE: process.env.NETWORK_MODE || "",
    RPC_URL: process.env.RPC_URL || "",
    SERVICE_URL: process.env.SERVICE_URL || "",
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Accept-Encoding, Content-Encoding",
          },
        ],
      },
    ];
  },

};

module.exports = nextConfig;
