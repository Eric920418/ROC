import type { Configuration } from "webpack";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false, // 關閉 React Strict Mode
  // 添加 images 配置
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/images/**",
      },
    ],
  },
  // 添加 CORS 設定
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    // 確保 config.resolve 與 alias 存在
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    if (!Array.isArray(config.resolve.alias)) {
      (
        config.resolve.alias as { [key: string]: string | false | string[] }
      ).canvas = false;
    }

    // 確保 config.module 與 config.module.rules 存在
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.pdf$/,
      type: "asset/resource",
      generator: {
        filename: "static/pdf/[hash][ext][query]",
      },
    });

    return config;
  },
};

export default nextConfig;
