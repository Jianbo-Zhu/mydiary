const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // i18n configuration is handled by next-intl/plugin, no need to define it here
  
  // These two configurations cannot be used simultaneously for the same package
  // We only use one configuration to resolve React version issues
  transpilePackages: [
    'next-intl'
  ],
  
  // 配置API代理
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
}

module.exports = withNextIntl(nextConfig); 