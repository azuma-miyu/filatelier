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
      // バリデーション
      if (!cardNumber || !expiry || !cvc) {
        throw new Error('全てのフィールドを入力してください');
      }

      // カートクリア
      clearCart();

      // 成功ページへ
      router.push('/checkout/success');
    } catch (err) {
      console.error('決済エラー:', err);
      setError(err.message || '決済に失敗しました');
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
              variant="outlined"
              fullWidth
              size="large"
              disabled={processing}
              sx={{ 
                mt: 3,
                borderColor: 'black',
                color: 'black',
                px: 6,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  borderColor: 'black',
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                },
                '&.Mui-disabled': {
                  borderColor: 'rgba(0, 0, 0, 0.26)',
                  color: 'rgba(0, 0, 0, 0.26)'
                }
              }}
            >
              {processing ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: 'black' }} />
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

