/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  api: {
    externalResolver: true,
  },
  env: {
    NETWORK_MODE: process.env.NETWORK_MODE || "",
    DAPP_SERVICE_URL: process.env.DAPP_SERVICE_URL || "",
    DAPP_AGENTS_SERVICE_URL: process.env.DAPP_AGENTS_SERVICE_URL || "",
    RPC_URL: process.env.RPC_URL || "",
    ECLIPSE_RPC_URL: process.env.ECLIPSE_RPC_URL || "",
    EDAS_AIRDROP_AMOUNT_SOLANA: process.env.EDAS_AIRDROP_AMOUNT_SOLANA || "",
    EDAS_AIRDROP_TOTAL_SLOT: process.env.EDAS_AIRDROP_TOTAL_SLOT || "",
    EDAS_AIRDROP_OPERATE_SYSTEM_PUBKEY:
      process.env.EDAS_AIRDROP_OPERATE_SYSTEM_PUBKEY || "",
    EDAS_TOKEN_ADDRESS: process.env.EDAS_TOKEN_ADDRESS || "",
    EDAS_STAKE_PROGRAM_ID: process.env.EDAS_STAKE_PROGRAM_ID || "",
    SOL_EDAS_POOL_ID: process.env.SOL_EDAS_POOL_ID || "",
    PRICE_FEED_SERVICE_URL: process.env.PRICE_FEED_SERVICE_URL,
    EDAS_STAKE_TOKEN_ADDRESS: process.env.EDAS_STAKE_TOKEN_ADDRESS || "",
		ENSOFI_API_KEY: process.env.ENSOFI_API_KEY || '',
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

  async rewrites() {
    return [
      {
        source: "/dapp-service/:path*",
        destination: `${process.env.DAPP_SERVICE_URL}/:path*`,
      },
      {
        source: "/agents-service/:path*",
        destination: `${process.env.DAPP_AGENTS_SERVICE_URL}/:path*`,
      },
      {
        source: "/price-feed-service/:path*",
        destination: `${process.env.PRICE_FEED_SERVICE_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
