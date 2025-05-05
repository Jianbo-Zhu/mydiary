import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'zh-CN'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Define routing configuration
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // No domains defined, using sub-path routing
});

// Create navigation API
export const { Link, redirect, usePathname, useRouter, getPathname } = 
  createNavigation(routing); 