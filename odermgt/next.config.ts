import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 배포 시 data 폴더를 강제로 포함시키는 설정 (이게 없으면 파일 못 찾음)
  outputFileTracingIncludes: {
    '/': ['./data/**/*'],
    '/orders/**/*': ['./data/**/*'],
    '/api/**/*': ['./data/**/*'],
  },
  // papaparse나 iconv-lite 같은 라이브러리 충돌 방지
  serverExternalPackages: ['iconv-lite'],
};

export default nextConfig;