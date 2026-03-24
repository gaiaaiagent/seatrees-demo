import type { NextConfig } from 'next';
import { resolve } from 'path';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  },
  turbopack: {
    root: resolve(__dirname),
  },
};

export default nextConfig;
