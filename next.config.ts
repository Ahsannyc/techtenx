import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
};

export default withSentryConfig(nextConfig, {
  org: "techtenx",
  project: "techtenx-web",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
});
