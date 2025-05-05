import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from '../../i18n/request';
import { locales, Locale } from '../../i18n/routing';
import Layout from 'components/Layout';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // Ensure params are resolved
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

  // Validate locale parameter
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} timeZone="Asia/Shanghai">
          <Layout>{children}</Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 