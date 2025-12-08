'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Paper, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { productsAPI } from '@/lib/api/client';
import Header from '@/components/layout/Header';

export default function NewProductPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/products');
    }
  }, [user, isAdmin, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await productsAPI.create({
        name,
        price: parseFloat(price),
        description,
        category,
        stock: parseInt(stock),
        imageUrl,
      });
      router.push('/admin/products');
    } catch (err) {
      console.error('商品作成エラー:', err);
      setError(err.response?.data?.error || '商品の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          新規商品追加
        </Typography>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="商品名"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />

            <TextField
              label="価格（円）"
              type="number"
              fullWidth
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              margin="normal"
            />

            <TextField
              label="説明"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />

            <TextField
              label="カテゴリ"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              margin="normal"
            />

            <TextField
              label="在庫数"
              type="number"
              fullWidth
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              margin="normal"
            />

            <TextField
              label="画像URL"
              fullWidth
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              margin="normal"
              helperText="画像のURLを入力してください（例: https://example.com/image.jpg）"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : '保存'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin/products')}
                disabled={loading}
                fullWidth
              >
                キャンセル
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
}

