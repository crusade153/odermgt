import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Vercel 파일 추적 설정 (필수)
  // 배포된 환경(Vercel)에서 로컬 CSV 파일(data 폴더)을 읽기 위해 경로를 명시적으로 포함합니다.
  outputFileTracingIncludes: {
    '/': ['./data/**/*'],
    '/orders/**/*': ['./data/**/*'],
    '/api/**/*': ['./data/**/*'],
  },

  // 2. 서버 사이드 패키지 예외 처리 (권장)
  // iconv-lite 같은 Node.js 전용 라이브러리가 번들링 에러를 일으키지 않도록 설정합니다.
  serverExternalPackages: ['iconv-lite'],
};

export default nextConfig;