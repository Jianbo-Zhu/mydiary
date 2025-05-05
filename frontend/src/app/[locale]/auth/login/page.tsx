'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Paper, TextField, Alert, Divider, Link } from '@mui/material';
import { Google, GitHub, Chat, Email } from '@mui/icons-material';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import NextLink from 'next/link';
import { authApi } from 'utils/api';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const commonT = useTranslations('common');
  const authT = useTranslations('auth');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // 检查URL参数，显示注册成功消息
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess(authT('registerSuccess'));
    }
  }, [searchParams, authT]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      
      // 保存token到localStorage
      localStorage.setItem('token', response.data.access_token);
      window.dispatchEvent(new Event('storage'));

      // 登录成功，重定向到首页
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || authT('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Login with Google');
  };

  const handleGithubLogin = () => {
    console.log('Login with GitHub');
  };

  const handleWechatLogin = () => {
    console.log('Login with WeChat');
  };

  const handleRegisterClick = () => {
    router.push('/auth/register');
  };

  return (
    <>
      <Head>
        <title>{commonT('login')} - {commonT('appName')}</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            {commonT('login')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
            {t.rich('loginDescription', {
              important: (chunks) => <b>{chunks}</b>
            })}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleEmailLogin} sx={{ width: '100%', mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={authT('email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={authT('password')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<Email />}
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? authT('loggingIn') : authT('loginWithEmail')}
            </Button>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Link component={NextLink} href="/auth/forgot-password" variant="body2">
                {authT('forgotPassword')}
              </Link>
              <Link component={NextLink} href="/auth/register" variant="body2">
                {commonT('register')}
              </Link>
            </Box>
          </Box>

          <Divider sx={{ width: '100%', my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {authT('orContinueWith')}
            </Typography>
          </Divider>
          
          <Box sx={{ width: '100%', mt: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              sx={{ mb: 2, py: 1.5 }}
            >
              {t('loginWithGoogle')}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              onClick={handleGithubLogin}
              sx={{ mb: 2, py: 1.5 }}
            >
              {t('loginWithGithub')}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Chat />}
              onClick={handleWechatLogin}
              sx={{ 
                py: 1.5,
                color: '#07C160',
                borderColor: '#07C160',
                '&:hover': {
                  borderColor: '#07C160',
                  backgroundColor: 'rgba(7, 193, 96, 0.04)'
                }
              }}
            >
              {t('loginWithWechat')}
            </Button>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {authT('noAccount')} {' '}
              <Link component={NextLink} href="/auth/register" variant="body2">
                {authT('registerNow')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
} 