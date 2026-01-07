import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 1. Webpack 설정 (CSV 파서 등 라이브러리 호환성 확보)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // externals가 배열인지 확인 후 push (안전장치)
      if (Array.isArray(config.externals)) {
        config.externals.push('csv-parse');
      } else {
        config.externals = ['csv-parse'];
      }
    }
    return config;
  },

  // 2. Vercel 파일 추적 설정 (이게 제일 중요합니다! ⭐)
  // data 폴더를 서버리스 함수(Lambda)로 강제 복사합니다.
  outputFileTracingIncludes: {
    '/': ['./data/**/*'],        // 메인 페이지에서 data 폴더 필요
    '/orders/**/*': ['./data/**/*'], // 상세 페이지에서도 필요
    '/api/**/*': ['./data/**/*'],    // API 라우트에서도 필요
  },
};

export default nextConfig;