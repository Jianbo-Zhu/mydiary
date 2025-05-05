'use client';
import { useState } from 'react';
import { Box, Button, Container, Typography, Paper, TextField, Alert, Link } from '@mui/material';
import { Email } from '@mui/icons-material';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { authApi } from 'utils/api';

export default function Register() {
  const router = useRouter();
  const t = useTranslations();
  const commonT = useTranslations('common');
  const authT = useTranslations('auth');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError(authT('allFieldsRequired'));
      return false;
    }
    
    if (password !== confirmPassword) {
      setError(authT('passwordMismatch'));
      return false;
    }
    
    if (password.length < 6) {
      setError(authT('passwordTooShort'));
      return false;
    }
    
    // 简单的邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(authT('invalidEmail'));
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await authApi.register(email, password);
      
      // 注册成功，重定向到登录页面
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(authT('emailAlreadyExists'));
      } else {
        setError(err.response?.data?.message || authT('registerFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{commonT('register')} - {commonT('appName')}</title>
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
            {commonT('register')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
            {t.rich('registerDescription', {
              important: (chunks) => <b>{chunks}</b>
            })}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleRegister} sx={{ width: '100%', mt: 1 }}>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={authT('confirmPassword')}
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<Email />}
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? authT('registering') : authT('registerWithEmail')}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {authT('alreadyHaveAccount')} {' '}
                <Link component={NextLink} href="/auth/login" variant="body2">
                  {commonT('login')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
} 