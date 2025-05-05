import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from './routing';

export async function getMessages(locale: string) {
  try {
    // Direct import to avoid potential compatibility issues with dynamic imports
    if (locale === 'zh-CN') {
      return (await import('messages/zh-CN.json')).default;
    }
    return (await import('messages/en.json')).default;
  } catch (error) {
    console.error(`Could not load messages for locale "${locale}"`, error);
    return (await import('messages/en.json')).default;
  }
}

// Configuration for next-intl
export default getRequestConfig(async ({
  requestLocale
}) => {
  // Get locale from request, corresponding to [locale] segment
  let locale = await requestLocale;
  
  // Ensure the requested locale is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  
  return {
    locale,
    messages: await getMessages(locale),
    timeZone: 'Asia/Shanghai',
    now: new Date(),
  };
}); 