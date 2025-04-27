import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/router';
import { getMessages } from '../utils/i18n';

// 创建Material UI主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6da7',
    },
    secondary: {
      main: '#ff8c42',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();
  const [messages, setMessages] = React.useState(pageProps.messages || {});

  React.useEffect(() => {
    async function loadMessages() {
      if (locale) {
        const msgs = await getMessages(locale);
        setMessages(msgs);
      }
    }
    
    if (Object.keys(messages).length === 0) {
      loadMessages();
    }
  }, [locale, messages]);

  return (
    <SessionProvider session={pageProps.session}>
      <NextIntlClientProvider locale={locale || 'en'} messages={messages}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}

export default MyApp; 