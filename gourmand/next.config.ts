import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 개발 서버(npm run dev)를 localhost가 아닌 주소로 열 때 허용할 주소.
  // 없으면 다른 사람이 IP로 접속했을 때 화면 스크립트가 막혀서 배너·버튼이 움직이지 않아요.
  // 10.2.*.* = 같은 네트워크(10.2.x.x)의 PC 주소 전부. 배포 후에는 영향 없음.
  allowedDevOrigins: ["10.2.16.112", "10.2.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
