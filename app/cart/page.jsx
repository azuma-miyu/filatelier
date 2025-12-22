'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Alert,
  Checkbox,
  Link,
} from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartItem from '@/components/cart/CartItem';
import Footer from '@/components/layout/Footer';

// Headerを動的インポート（SSRを無効化してHydration Errorを防ぐ）
const Header = dynamic(() => import('@/components/layout/Header'), {
  ssr: false,
  loading: () => <Box sx={{ height: 64 }} />
});

export default function CartPage() {
  const router = useRouter();
  const { 
    items, 
    totalPrice, 
    totalItems, 
    selectedItems,
    toggleAllItems,
    removeSelectedItems,
    selectedTotalPrice,
    selectedTotalItems
  } = useCart();
  const { user } = useAuth();

  const allSelected = items.length > 0 && selectedItems.length === items.length;

  const handleCheckout = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
              カートに商品がありません。
            </Typography>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/products')}
              sx={{
                borderColor: 'black',
                color: 'black',
                px: 6,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  borderColor: 'black',
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              商品一覧へ
            </Button>
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {!user && (
          <Alert severity="info" sx={{ mb: 2 }}>
            決済を行うにはログインが必要です
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* 商品リスト */}
          <Box sx={{ flex: 1 }}>
            {/* 全選択と削除 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Checkbox 
                checked={allSelected}
                indeterminate={selectedItems.length > 0 && selectedItems.length < items.length}
                onChange={toggleAllItems}
              />
              <Link
                component="button"
                variant="body2"
                color="text.secondary"
                onClick={removeSelectedItems}
                disabled={selectedItems.length === 0}
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  '&:disabled': { color: 'text.disabled', cursor: 'not-allowed' }
                }}
              >
                選択商品を削除
              </Link>
            </Box>

            {/* 商品一覧 */}
            <Box>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </Box>
          </Box>

          {/* 価格サマリー */}
          <Box sx={{ width: { xs: '100%', md: 400 } }}>
            <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
              {/* 小計 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">小計</Typography>
                <Typography variant="body1" fontWeight="500">
                  ¥{totalPrice.toLocaleString()}
                </Typography>
              </Box>

              {/* 送料 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">送料</Typography>
                <Typography variant="body1" fontWeight="500">
                  無料
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* 合計金額 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">合計金額</Typography>
                <Typography variant="h6">
                  ¥{totalPrice.toLocaleString()}
                </Typography>
              </Box>

              {/* 注文ボタン */}
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ 
                  borderColor: 'black',
                  color: 'black',
                  px: 6,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: 'black',
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                注文手続きへ
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

