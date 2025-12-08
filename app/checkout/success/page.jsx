'use client';

import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Header from '@/components/layout/Header';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            決済が完了しました！
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            ご購入ありがとうございます。
            <br />
            注文の詳細はメールでお送りいたします。
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => router.push('/products')}
            >
              商品一覧へ
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

