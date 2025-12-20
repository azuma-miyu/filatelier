'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, isInitialized } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Hydration Error対策: 初期化前は0を表示
  const displayTotalItems = isInitialized ? totalItems : 0;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/login');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => router.push('/products')}
        >
          Fil Atelier
        </Typography>

        {user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAdmin && (
                <Button
                  color="inherit"
                  startIcon={<AdminPanelSettingsIcon />}
                  onClick={() => router.push('/admin/products')}
                >
                  管理画面
                </Button>
              )}

              <IconButton
                color="inherit"
                onClick={() => router.push('/cart')}
                aria-label="カート"
              >
                <Badge badgeContent={displayTotalItems} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                aria-label="ユーザーメニュー"
              >
                <PersonIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {user.display_name || user.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <Button color="inherit" onClick={() => router.push('/login')}>
            ログイン
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

