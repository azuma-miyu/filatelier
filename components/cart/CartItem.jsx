'use client';

import {
  Typography,
  IconButton,
  Box,
  Checkbox,
  Link,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '@/contexts/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart, selectedItems, toggleItemSelection } = useCart();
  const isSelected = selectedItems.includes(item.product.id);

  const handleIncrease = () => {
    if (item.quantity < item.product.stock) {
      updateQuantity(item.product.id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= item.product.stock) {
      updateQuantity(item.product.id, value);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.product.id);
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2,
        py: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        alignItems: 'flex-start'
      }}
    >
      {/* チェックボックス */}
      <Checkbox 
        checked={isSelected}
        onChange={() => toggleItemSelection(item.product.id)}
        sx={{ pt: 0 }}
      />

      {/* 商品画像 */}
      <Box
        component="img"
        src={item.product.imageUrl || '/placeholder-product.jpg'}
        alt={item.product.name}
        sx={{ 
          width: 120, 
          height: 120, 
          objectFit: 'cover',
          borderRadius: 1,
          bgcolor: 'grey.100'
        }}
      />

      {/* 商品情報 */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" fontWeight="500" sx={{ mb: 0.5 }}>
          {item.product.name}
        </Typography>
        
        {/* バリエーション情報（サイズ/色） */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {item.product.category || 'standard'} {item.product.size && `(${item.product.size})`}
          </Typography>
        </Box>

        {/* 削除リンク */}
        <Link
          component="button"
          variant="body2"
          color="text.secondary"
          onClick={handleRemove}
          sx={{ 
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          削除
        </Link>
      </Box>

      {/* 価格 */}
      <Typography variant="body1" fontWeight="500" sx={{ minWidth: 100, textAlign: 'right' }}>
        ¥{item.product.price.toLocaleString()}
      </Typography>

      {/* 数量調整 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            width: 28,
            height: 28
          }}
        >
          <RemoveIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Typography 
          variant="body2" 
          sx={{ 
            minWidth: 40, 
            textAlign: 'center',
            px: 1
          }}
        >
          {item.quantity}
        </Typography>
        <IconButton
          size="small"
          onClick={handleIncrease}
          disabled={item.quantity >= item.product.stock}
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            width: 28,
            height: 28
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

