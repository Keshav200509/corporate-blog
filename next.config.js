/** @type {import('next').NextConfig} */
const isProductionNodeEnv = process.env.NODE_ENV === "production";
const isNextBuildOrStartCommand = process.argv.includes("build") || process.argv.includes("start");
const isManagedDeployEnvironment =
  process.env.CI === "true" || Boolean(process.env.VERCEL) || Boolean(process.env.NETLIFY);

if (isProductionNodeEnv && isNextBuildOrStartCommand && isManagedDeployEnvironment) {
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error("NEXT_PUBLIC_SITE_URL is required in production CI/deploy environments");
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production CI/deploy environments");
  }
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  }
};

module.exports = nextConfig;
