'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tabValue === 0) {
        // ログイン
        await signIn(email, password);
      } else {
        // 新規登録
        if (!displayName.trim()) {
          setError('表示名を入力してください');
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName);
      }
      router.push('/products');
    } catch (err) {
      console.error('ログイン/新規登録エラー:', err);
      // ネットワークエラーの場合、より分かりやすいメッセージを表示
      if (err.isNetworkError || (!err.response && (err.message.includes('Network') || err.message.includes('タイムアウト') || err.code === 'ECONNABORTED'))) {
        setError(err.message || 'バックエンドサーバーに接続できません。バックエンドが起動しているか確認してください。');
      } else {
        // バックエンドからのエラーメッセージを表示
        const errorMessage = err.response?.data?.error || err.message || 'エラーが発生しました。もう一度お試しください';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '100%',
            py: 4,
          }}
        >
          <Card sx={{ width: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom align="center">
                Fil Atelier
              </Typography>
              
              <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
                <Tab label="ログイン" />
                <Tab label="新規登録" />
              </Tabs>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="メールアドレス"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  autoComplete="email"
                />

                <TextField
                  label="パスワード"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  autoComplete={tabValue === 0 ? 'current-password' : 'new-password'}
                />

                {tabValue === 1 && (
                  <TextField
                    label="表示名"
                    type="text"
                    fullWidth
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    margin="normal"
                    autoComplete="name"
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 3,
                    backgroundColor: '#87888D',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#6D6E72',
                    }
                  }}
                >
                  {loading
                    ? '処理中...'
                    : tabValue === 0
                    ? 'ログイン'
                    : '新規登録'}
                </Button>
              </form>

              {tabValue === 1 && (
                <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center' }}>
                  管理者として登録する場合は、@admin.comで終わるメールアドレスを使用してください
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

