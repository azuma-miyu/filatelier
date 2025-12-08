'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { stripeAPI, ordersAPI } from '@/lib/api/client';
import Header from '@/components/layout/Header';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/25');
  const [cvc, setCvc] = useState('123');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [user, items, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // 1. Payment Intent作成
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      await stripeAPI.createPaymentIntent({
        amount: totalPrice,
        items: orderItems,
      });

      // 2. モック決済処理（2秒待機）
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. バリデーション
      if (!cardNumber || !expiry || !cvc) {
        throw new Error('全てのフィールドを入力してください');
      }

      // 4. 注文作成
      await ordersAPI.create({
        items: orderItems,
        total: totalPrice,
        status: 'paid',
      });

      // 5. カートクリア
      clearCart();

      // 6. 成功ページへ
      router.push('/checkout/success');
    } catch (err) {
      console.error('決済エラー:', err);
      setError(err.response?.data?.error || err.message || '決済に失敗しました');
      setProcessing(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          決済
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            注文内容
          </Typography>
          <Divider sx={{ my: 2 }} />
          {items.map((item) => (
            <Box
              key={item.product.id}
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography>
                {item.product.name} × {item.quantity}
              </Typography>
              <Typography>
                ¥{(item.product.price * item.quantity).toLocaleString()}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">合計:</Typography>
            <Typography variant="h6" color="primary">
              ¥{totalPrice.toLocaleString()}
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            支払い情報
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            これはモック決済です。実際の決済は行われません。
          </Alert>

          <form onSubmit={handleSubmit}>
            <TextField
              label="カード番号"
              fullWidth
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              margin="normal"
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="有効期限"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                margin="normal"
                sx={{ flex: 1 }}
              />
              <TextField
                label="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                margin="normal"
                sx={{ flex: 1 }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={processing}
              sx={{ mt: 3 }}
            >
              {processing ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  処理中...
                </>
              ) : (
                `¥${totalPrice.toLocaleString()}を支払う`
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}

