'use client';

/**
 * 決済ページ（Stripe決済対応）
 * 
 * 処理の流れ:
 * 1. カート情報を表示
 * 2. Stripe Elements（カード入力フォーム）を表示
 * 3. お客様がカード情報を入力
 * 4. 決済実行
 * 5. 決済成功したら注文をDBに保存
 * 6. 成功ページへリダイレクト
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StripePaymentForm from '@/components/checkout/StripePaymentForm';
import { createPaymentIntent, createOrder } from '@/lib/api/stripe';

// Stripe初期化（この変数はコンポーネント外で宣言）
let stripePromise = null;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stripe初期化
  useEffect(() => {
    if (!stripePromise) {
      // 環境変数からStripe公開キーを取得
      let publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      
      // ダミーキーまたは未設定の場合はモックキーを使用
      if (!publishableKey || publishableKey.includes('dummy')) {
        publishableKey = 'pk_test_51QYqHfP3bqj3KxZxDummyKeyForDevelopmentUITestOnly';
        console.warn('⚠️ モックStripeキーを使用しています。実際の決済は行われません。');
      }
      
      stripePromise = loadStripe(publishableKey);
    }
  }, []);

  // ログインチェック & カート空チェック
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

  // PaymentIntent作成
  useEffect(() => {
    if (!user || items.length === 0) return;

    const initializePayment = async () => {
      try {
        setLoading(true);
        
        /**
         * バックエンドにPaymentIntent作成を依頼
         * → Stripeが決済の準備をする
         * → client_secretを受け取る
         */
        const result = await createPaymentIntent(totalPrice);
        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);
        setLoading(false);
      } catch (err) {
        console.error('決済の準備エラー:', err);
        
        // ローカル開発用: バックエンドがない場合はテストモード
        if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
          setError('⚠️ バックエンドが起動していません。UIの確認のみ可能です。実際の決済を試すにはバックエンドを起動してください。');
          // テスト用のダミーclientSecret（Stripe UIの表示のみ）
          setClientSecret('pi_test_secret_dummy_for_ui_testing_only');
          setLoading(false);
        } else {
          setError(err.message || '決済の準備に失敗しました');
          setLoading(false);
        }
      }
    };

    initializePayment();
  }, [user, items, totalPrice]);

  /**
   * 決済成功時のハンドラ
   * 
   * 処理:
   * 1. Stripeで決済成功
   * 2. バックエンドに注文データを送信
   * 3. DBに注文保存、在庫減算
   * 4. カートクリア
   * 5. 成功ページへ
   */
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      console.log('決済成功、注文を作成中...', paymentIntent);
      
      // 注文データ作成
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: totalPrice,
        stripePaymentIntentId: paymentIntent.id
      };
      
      // バックエンドに注文保存を依頼
      await createOrder(orderData);
      
      // カートクリア
      clearCart();
      
      // 成功ページへ
      router.push('/checkout/success');
    } catch (err) {
      console.error('注文作成エラー:', err);
      setError(err.message || '注文の作成に失敗しました');
    }
  };

  /**
   * 決済失敗時のハンドラ
   */
  const handlePaymentError = (error) => {
    console.error('決済失敗:', error);
    setError(error.message || '決済に失敗しました');
  };

  // ローディング中
  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            決済の準備中...
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  // ユーザーがいない or カートが空
  if (!user || items.length === 0) {
    return null;
  }

  // Stripe Elementsのオプション
  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',  // Stripeのデフォルトテーマ
      variables: {
        colorPrimary: '#000000',
      }
    },
    locale: 'ja'  // 日本語
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          決済
        </Typography>

        {/* エラー表示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 注文内容 */}
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

        {/* 決済フォーム */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            カード情報
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              テストモード: テストカード番号 <strong>4242 4242 4242 4242</strong> を使用できます。
              <br />
              有効期限: 未来の日付、CVC: 任意の3桁
            </Typography>
          </Alert>

          {/* Stripe Elements */}
          {clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <StripePaymentForm
                amount={totalPrice}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          )}
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
