import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // 支持的语言列表
  locales,
  // 默认语言
  defaultLocale,
  // 本地化子路径配置 (可选，/en/blog)
  localePrefix: 'as-needed',
});

export const config = {
  // 匹配所有路径，除了以下路径：
  // - API 路由
  // - 静态文件
  // - 内部 Next.js 文件
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 