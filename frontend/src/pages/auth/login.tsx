import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';
import Head from 'next/head';

export default function Login() {
  // 这里仅为前端展示，实际应接入OAuth认证
  const handleGoogleLogin = () => {
    console.log('使用Google登录');
  };

  const handleGithubLogin = () => {
    console.log('使用GitHub登录');
  };

  return (
    <>
      <Head>
        <title>登录 - 个人日常与人际关系管理系统</title>
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
            登录
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
            使用社交账号登录以保护您的隐私和数据安全
          </Typography>
          
          <Box sx={{ width: '100%', mt: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              sx={{ mb: 2, py: 1.5 }}
            >
              使用Google账号登录
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              onClick={handleGithubLogin}
              sx={{ py: 1.5 }}
            >
              使用GitHub账号登录
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
} 