const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // 支持的语言列表
    locales: ['en', 'zh-CN'],
    // 默认语言
    defaultLocale: 'en',
    // 本地化域名配置（可选）
    // domains: [
    //   {
    //     domain: 'example.com',
    //     defaultLocale: 'en',
    //   },
    //   {
    //     domain: 'example.cn',
    //     defaultLocale: 'zh-CN',
    //   },
    // ],
  },
}

module.exports = withNextIntl({
  // 其他 Next.js 配置
  ...nextConfig,
}); 