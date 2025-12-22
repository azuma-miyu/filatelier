'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = 'shopping-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // 選択された商品のID配列
  const [isInitialized, setIsInitialized] = useState(false);

  // localStorageからカート情報を読み込み
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('カート情報の読み込みエラー:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // カート情報をlocalStorageに保存
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('カート情報の保存エラー:', error);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        // 既にカートにある場合は数量を増やす
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 新しい商品を追加し、自動的に選択状態にする
        setSelectedItems((prev) => [...prev, product.id]);
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setSelectedItems([]);
  };

  // 商品の選択を切り替え
  const toggleItemSelection = (productId) => {
    setSelectedItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // 全商品の選択を切り替え
  const toggleAllItems = () => {
    if (selectedItems.length === items.length) {
      // 全選択解除
      setSelectedItems([]);
    } else {
      // 全選択
      setSelectedItems(items.map((item) => item.product.id));
    }
  };

  // 選択された商品を削除
  const removeSelectedItems = () => {
    setItems((prevItems) => 
      prevItems.filter((item) => !selectedItems.includes(item.product.id))
    );
    setSelectedItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // 選択された商品の合計
  const selectedTotalItems = items
    .filter((item) => selectedItems.includes(item.product.id))
    .reduce((sum, item) => sum + item.quantity, 0);
  const selectedTotalPrice = items
    .filter((item) => selectedItems.includes(item.product.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    selectedItems,
    toggleItemSelection,
    toggleAllItems,
    removeSelectedItems,
    selectedTotalItems,
    selectedTotalPrice,
    isInitialized, // Hydration Error対策用
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

