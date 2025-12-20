'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { productsAPI } from '@/lib/api/client';
import { mockProducts } from '@/lib/mock/products';
import ProductList from '@/components/products/ProductList';
import Header from '@/components/layout/Header';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll();
        const fetchedProducts = response.data || [];
        
        // APIから商品が取得できた場合
        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
          setUsingMock(false);
        } else {
          // APIは成功したが商品が空の場合、モックデータを使用
          console.log('商品が空のため、モックデータを使用します');
          setProducts(mockProducts);
          setUsingMock(true);
        }
        setError('');
      } catch (err) {
        // ネットワークエラーやタイムアウトの場合、モックデータを使用
        if (!err.response) {
          // バックエンドが起動していない場合
          console.log('バックエンドが起動していないため、モックデータを表示します');
          setProducts(mockProducts);
          setUsingMock(true);
          setError(''); // エラーメッセージを表示しない（モックデータで動作していることを通知するだけ）
        } else {
          // その他のAPIエラー
          console.error('商品取得エラー:', err);
          setError('商品を取得できませんでした');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3 } }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {usingMock && !loading && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              backgroundColor: '#f5f5f5',
              color: 'text.secondary',
              '& .MuiAlert-icon': {
                color: 'text.secondary'
              }
            }}
          >
            モックデータを表示中
          </Alert>
        )}

        {!loading && products.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              現在、商品がありません
            </Typography>
          </Box>
        )}

        {!loading && products.length > 0 && (
          <ProductList products={products} />
        )}
      </Container>
    </>
  );
}

