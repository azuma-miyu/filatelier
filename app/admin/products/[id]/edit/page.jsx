'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Typography, Box, Paper, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { productsAPI } from '@/lib/api/client';
import Header from '@/components/layout/Header';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/products');
      return;
    }

    if (user && isAdmin && productId) {
      fetchProduct();
    }
  }, [user, isAdmin, authLoading, productId, router]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(productId);
      const product = response.data;
      setName(product.name);
      setPrice(product.price.toString());
      setDescription(product.description || '');
      setCategory(product.category || '');
      setStock(product.stock.toString());
      setImageUrl(product.imageUrl || '');
    } catch (err) {
      console.error('商品取得エラー:', err);
      setError('商品を取得できませんでした');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await productsAPI.update(productId, {
        name,
        price: parseFloat(price),
        description,
        category,
        stock: parseInt(stock),
        imageUrl,
      });
      router.push('/admin/products');
    } catch (err) {
      console.error('商品更新エラー:', err);
      setError(err.response?.data?.error || '商品の更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          商品編集
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
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : '更新'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin/products')}
                disabled={saving}
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

