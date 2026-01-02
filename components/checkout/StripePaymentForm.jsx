'use client';

/**
 * Stripeカード入力フォーム
 * 
 * このコンポーネントの役割:
 * 1. Stripeが提供するセキュアなカード入力フォームを表示
 * 2. カード情報はStripeのサーバーに直接送信（あなたのサーバーを経由しない）
 * 3. 決済処理を実行
 */

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button, CircularProgress, Alert, Box } from '@mui/material';

export default function StripePaymentForm({ amount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Stripe.jsがまだ読み込まれていない場合
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      /**
       * confirmPayment: カード決済を実行
       * 
       * 処理の流れ:
       * 1. カード情報をStripeに送信
       * 2. Stripeがカード会社に確認
       * 3. 承認されたら決済完了
       * 4. 失敗したらエラー
       */
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',  // リダイレクト不要（SPA内で完結）
        confirmParams: {
          return_url: window.location.origin + '/checkout/success',
        },
      });

      if (error) {
        // 決済失敗
        console.error('決済エラー:', error);
        setErrorMessage(error.message);
        if (onError) onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 決済成功！
        console.log('決済成功:', paymentIntent);
        if (onSuccess) onSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('予期しないエラー:', err);
      setErrorMessage('決済処理中にエラーが発生しました');
      if (onError) onError(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Stripeが提供するカード入力フォーム */}
      <Box sx={{ mb: 3 }}>
        <PaymentElement />
      </Box>

      {/* エラーメッセージ */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* 決済ボタン */}
      <Button
        type="submit"
        variant="outlined"
        fullWidth
        size="large"
        disabled={!stripe || processing}
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
          `¥${amount.toLocaleString()}を支払う`
        )}
      </Button>
    </form>
  );
}


