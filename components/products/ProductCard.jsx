'use client';

import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import { useCart } from '@/contexts/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <Box
      sx={{
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 商品画像 */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // 正方形
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
          mb: 1.5,
        }}
      >
        <Box
          component="img"
          src={product.imageUrl || '/placeholder-product.jpg'}
          alt={product.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        
        {/* カートに追加ボタン（ホバー時表示） */}
        {product.stock > 0 && (
          <IconButton
            onClick={handleAddToCart}
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'white',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <ShoppingCartOutlined sx={{ fontSize: 20 }} />
          </IconButton>
        )}
        
        {/* 在庫切れラベル */}
        {product.stock === 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
            }}
          >
            在庫切れ
          </Box>
        )}
      </Box>

      {/* 商品情報 */}
      <Box sx={{ px: 0.5 }}>
        {/* 商品名 */}
        <Typography
          variant="body2"
          sx={{
            mb: 0.5,
            color: 'text.primary',
            fontSize: '0.875rem',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>

        {/* 価格 */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          ¥{product.price.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

