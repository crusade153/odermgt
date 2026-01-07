import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ 에러 나던 experimental 부분 삭제함

  // 1. Webpack 설정 (CSV 파서 라이브러리용 - 필수)
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

  // 2. Vercel 파일 추적 설정 (data 폴더 강제 포함 - 필수)
  outputFileTracingIncludes: {
    '/': ['./data/**/*'],
    '/orders/**/*': ['./data/**/*'],
    '/api/**/*': ['./data/**/*'],
  },
};

export default nextConfig;