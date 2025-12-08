'use client';

import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartItem from '@/components/cart/CartItem';
import Header from '@/components/layout/Header';

export default function CartPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCartIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              カートが空です
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              商品を追加してください
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinueShopping}
            >
              商品一覧へ
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ショッピングカート
        </Typography>

        {!user && (
          <Alert severity="info" sx={{ mb: 2 }}>
            決済を行うにはログインが必要です
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </Box>

          <Box sx={{ width: { xs: '100%', md: 300 } }}>
            <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
              <Typography variant="h6" gutterBottom>
                注文概要
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>商品点数:</Typography>
                <Typography>{totalItems}点</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>小計:</Typography>
                <Typography>¥{totalPrice.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">合計:</Typography>
                <Typography variant="h6" color="primary">
                  ¥{totalPrice.toLocaleString()}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ mb: 2 }}
              >
                決済へ進む
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleContinueShopping}
                sx={{ mb: 1 }}
              >
                買い物を続ける
              </Button>
              <Button
                variant="text"
                fullWidth
                color="error"
                onClick={clearCart}
                size="small"
              >
                カートを空にする
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
}

