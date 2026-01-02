/**
 * Stripe決済API
 * 
 * このファイルの役割:
 * フロントエンドからバックエンドのStripe APIを呼び出すための関数群
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * PaymentIntent作成
 * 
 * 説明:
 * 1. バックエンドに決済金額を送信
 * 2. バックエンドがStripe APIでPaymentIntentを作成
 * 3. client_secretを受け取る
 * 4. このclient_secretを使ってカード決済を行う
 */
export async function createPaymentIntent(amount) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/stripe/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '決済の準備に失敗しました');
  }
  
  return response.json();
}

/**
 * 決済検証
 * 
 * 説明:
 * フロントエンドで決済完了後、バックエンドに再確認を依頼
 * （セキュリティのため、クライアント側の情報だけを信用しない）
 */
export async function verifyPayment(paymentIntentId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/stripe/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ paymentIntentId })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '決済の検証に失敗しました');
  }
  
  return response.json();
}

/**
 * Stripe公開キー取得
 * 
 * 説明:
 * Stripe.jsを初期化するための公開キーをバックエンドから取得
 */
export async function getStripeConfig() {
  const response = await fetch(`${API_URL}/stripe/config`);
  
  if (!response.ok) {
    throw new Error('Stripe設定の取得に失敗しました');
  }
  
  return response.json();
}

/**
 * 注文作成（決済完了後）
 * 
 * 説明:
 * 決済成功後、注文データをバックエンドに送信してDBに保存
 */
export async function createOrder(orderData) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '注文の作成に失敗しました');
  }
  
  return response.json();
}


