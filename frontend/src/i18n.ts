import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// 支持的语言
export const locales = ['en', 'zh-CN'];
export const defaultLocale = 'en';

// 语言名称映射
export const localeNames = {
  'en': 'English',
  'zh-CN': '中文（简体）',
};

export default getRequestConfig(async ({locale}) => {
  // 验证请求的语言是否支持
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: await import(`./locales/${locale}.json`).then(
      (module) => module.default
    ),
    timeZone: 'Asia/Shanghai',
    now: new Date(),
  };
}); 