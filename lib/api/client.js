import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// axiosインスタンス作成
const api = axios.create({
  baseURL: API_URL,
  timeout: 3000, // 3秒でタイムアウト（バックエンドがない場合にすぐにモックデータに切り替え）
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（JWTトークン自動付与）
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ネットワークエラーやタイムアウトの場合、エラーをそのまま返す（モックデータにフォールバックするため）
    if (!error.response) {
      // ネットワークエラー（バックエンドが起動していないなど）
      console.warn('バックエンドに接続できません。モックデータを使用します。', error.message);
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      // 認証エラー時はトークンを削除
      // ただし、ログインページからのリクエストの場合はリダイレクトしない
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // 現在のパスがログインページでない場合のみリダイレクト
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// 認証API（タイムアウトを長めに設定）
export const authAPI = {
  register: (data) => {
    return api.post('/auth/register', data, { timeout: 10000 }); // 10秒
  },
  login: (data) => {
    return api.post('/auth/login', data, { timeout: 10000 }); // 10秒
  },
  getCurrentUser: () => api.get('/auth/me'),
};

// 商品API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// 注文API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

// Stripe API
export const stripeAPI = {
  createPaymentIntent: (data) => api.post('/stripe/create-payment-intent', data),
};

export default api;

