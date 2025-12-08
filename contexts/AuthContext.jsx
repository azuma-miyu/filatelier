'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api/client';
import { authenticateMockUser, generateMockToken, mockUsers } from '@/lib/mock/auth';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // トークンがある場合、ユーザー情報を取得
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        loadUser();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      // ネットワークエラーの場合、モックトークンからユーザー情報を復元
      if (!error.response && typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        
        // モックトークンの場合
        if (token && token.startsWith('mock_token_')) {
          console.log('モック認証モード: ユーザー情報を復元します');
          const userId = parseInt(token.split('_')[2]);
          const mockUser = mockUsers.find(u => u.id === userId);
          
          if (mockUser) {
            const { password: _, ...userWithoutPassword } = mockUser;
            setUser(userWithoutPassword);
            setLoading(false);
            return;
          }
        }
        
        console.warn('バックエンドに接続できません。ログイン状態をリセットします。');
        localStorage.removeItem('token');
      } else {
        console.error('ユーザー情報取得エラー:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, displayName) => {
    try {
      const response = await authAPI.register({ email, password, displayName });
      
      // レスポンスの検証
      if (!response || !response.data) {
        throw new Error('サーバーからの応答が不正です');
      }
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('認証情報が取得できませんでした');
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      setUser(user);
      return user;
    } catch (error) {
      console.error('新規登録エラー詳細:', error);
      
      // ネットワークエラーの場合
      if (!error.response) {
        // モック認証では新規登録はできない（既存のテストアカウントのみ使用可能）
        throw new Error('バックエンドサーバーに接続できません。モック認証では新規登録はできません。テストアカウント（user@example.com / password123）でログインしてください。');
      }
      
      // バックエンドからのエラーはそのまま投げる
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      // レスポンスの検証
      if (!response || !response.data) {
        throw new Error('サーバーからの応答が不正です');
      }
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('認証情報が取得できませんでした');
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      setUser(user);
      return user;
    } catch (error) {
      console.error('ログインエラー詳細:', error);
      
      // ネットワークエラーの場合、モック認証を使用
      if (!error.response) {
        console.log('バックエンドに接続できないため、モック認証を使用します');
        
        // モック認証を試行
        const mockUser = authenticateMockUser(email, password);
        
        if (mockUser) {
          // モックトークンを生成
          const mockToken = generateMockToken(mockUser.id);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', mockToken);
          }
          
          setUser(mockUser);
          return mockUser;
        } else {
          // モック認証も失敗
          throw new Error('メールアドレスまたはパスワードが間違っています');
        }
      }
      
      // バックエンドからのエラー（認証エラーなど）はそのまま投げる
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAdmin: user?.is_admin || false,
    signUp,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

