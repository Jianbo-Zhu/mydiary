'use server';

import { redirect } from '../i18n/routing';
import { useLocale } from 'next-intl';

export async function redirectToDashboard() {
  const locale = await useLocale();
  
  // In next-intl 4.0, redirect needs to explicitly specify the locale
  redirect({
    href: '/dashboard',
    locale
  });
} 