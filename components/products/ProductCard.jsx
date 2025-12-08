'use client';

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '@/contexts/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl || '/placeholder-product.jpg'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description && product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            ¥{product.price.toLocaleString()}
          </Typography>
          <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
            {product.stock > 0 ? `在庫: ${product.stock}` : '在庫切れ'}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          カートに追加
        </Button>
      </CardActions>
    </Card>
  );
}

