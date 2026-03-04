import type { NextConfig } from 'next';
import { resolve } from 'path';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  turbopack: {
    root: resolve(__dirname),
  },
};

export default nextConfig;
