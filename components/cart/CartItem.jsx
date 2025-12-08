'use client';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '@/contexts/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

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
    <Card sx={{ display: 'flex', mb: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 150 }}
        image={item.product.imageUrl || '/placeholder-product.jpg'}
        alt={item.product.name}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant="h6" component="div">
            {item.product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.product.description && item.product.description.length > 80
              ? `${item.product.description.substring(0, 80)}...`
              : item.product.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" color="primary">
              単価: ¥{item.product.price.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type="number"
                value={item.quantity}
                onChange={handleQuantityChange}
                inputProps={{
                  min: 1,
                  max: item.product.stock,
                  style: { textAlign: 'center' },
                }}
                sx={{ width: 60 }}
                size="small"
              />
              <IconButton
                size="small"
                onClick={handleIncrease}
                disabled={item.quantity >= item.product.stock}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{ ml: 'auto' }}>
              小計: ¥{subtotal.toLocaleString()}
            </Typography>
            <IconButton color="error" onClick={handleRemove}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}

