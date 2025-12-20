'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
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
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* 左側: ストア名 */}
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            cursor: 'pointer',
            color: 'text.primary',
            fontWeight: 400,
            fontSize: '1.1rem',
            letterSpacing: '0.05em'
          }}
          onClick={() => router.push('/products')}
        >
          Fil Atelier
        </Typography>

        {/* 右側: アイコンメニュー */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {user ? (
            <>
              {/* カートアイコン */}
              <IconButton
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
                disableRipple
                onClick={() => router.push('/cart')}
                aria-label="カート"
              >
                <Badge badgeContent={displayTotalItems} color="error">
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>

              {/* ユーザーメニューアイコン */}
              <IconButton
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
                disableRipple
                onClick={handleMenuOpen}
                aria-label="メニュー"
              >
                <MenuOutlined />
              </IconButton>

              {/* ドロップダウンメニュー */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user.display_name || user.email}
                  </Typography>
                </MenuItem>
                <Divider />
                {isAdmin && (
                  <MenuItem onClick={() => { handleMenuClose(); router.push('/admin/products'); }}>
                    <AdminPanelSettingsOutlined sx={{ mr: 1, fontSize: 20 }} />
                    管理画面
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <PersonOutlined sx={{ mr: 1, fontSize: 20 }} />
                  ログアウト
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* カートアイコン（ログイン前） */}
              <IconButton
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
                disableRipple
                onClick={() => router.push('/cart')}
                aria-label="カート"
              >
                <Badge badgeContent={displayTotalItems} color="error">
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>

              {/* ログインボタン */}
              <IconButton
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
                disableRipple
                onClick={() => router.push('/login')}
                aria-label="ログイン"
              >
                <PersonOutlined />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

