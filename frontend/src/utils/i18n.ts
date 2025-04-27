import { getRequestConfig } from 'next-intl/server';

// 支持的语言列表
export const locales = ['en', 'zh-CN'];
export const defaultLocale = 'en';

// 获取消息并创建 intl 对象的函数
export async function getMessages(locale: string) {
  try {
    return (await import(`../locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale "${locale}"`, error);
    return (await import(`../locales/${defaultLocale}.json`)).default;
  }
}

// 用于服务端的 intl 配置
export async function getI18nConfig() {
  return getRequestConfig(async ({ locale }) => {
    return {
      messages: await getMessages(locale),
      timeZone: 'Asia/Shanghai',
      now: new Date(),
    };
  });
}

// 语言名称映射
export const localeNames = {
  'en': 'English',
  'zh-CN': '中文（简体）',
}; 