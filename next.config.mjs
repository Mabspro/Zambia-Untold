import nextPWA from "next-pwa";

/** Set DISABLE_PWA=1 to skip PWA (avoids spawn EPERM in restricted build environments). */
const pwaDisabled = process.env.DISABLE_PWA === "1" || process.env.DISABLE_PWA === "true";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /\.(?:js|css|woff2?)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-bundles",
        expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      urlPattern: /\/(?:textures|data)\/.*\.(?:json|geojson|png|jpg|jpeg|webp|svg)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "atlas-static-data",
        expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 90 },
      },
    },
    {
      urlPattern: /\/_next\/static\/.+$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon.svg", permanent: false },
    ];
  },
  /**
   * Raw loader for GLSL shader files (.vert / .frag / .glsl).
   * Allows: import XRAY_VERTEX from "./shaders/xray.vert";
   * Resolves TD-06: inline shaders in Globe.tsx migrated to /shaders/ directory.
   */
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      type: "asset/source",
    });
    return config;
  },
};

/** Skip PWA wrapper entirely when DISABLE_PWA is set (avoids spawn EPERM in restricted envs). */
export default pwaDisabled ? nextConfig : withPWA(nextConfig);
