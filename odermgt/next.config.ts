import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 1. 로컬 에러 해결용 (터보팩 빈 설정 추가)
  experimental: {
    turbo: {},
  },

  // 2. Webpack 설정 (CSV 파서 라이브러리용)
  webpack: (config, { isServer }) => {
    if (isServer) {
      if (Array.isArray(config.externals)) {
        config.externals.push('csv-parse');
      } else {
        config.externals = ['csv-parse'];
      }
    }
    return config;
  },

  // 3. Vercel 파일 추적 설정 (data 폴더 강제 포함)
  outputFileTracingIncludes: {
    '/': ['./data/**/*'],
    '/orders/**/*': ['./data/**/*'],
    '/api/**/*': ['./data/**/*'],
  },
};

export default nextConfig;