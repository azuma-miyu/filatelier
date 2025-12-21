'use client';

import { Box, Container, IconButton, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#87888D',
        color: 'white',
        py: 2,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* 左側: 空白 */}
          <Box sx={{ width: 40 }} />

          {/* 中央: コピーライト */}
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              fontSize: '0.875rem'
            }}
          >
            © 2025 Fil Atelier
          </Typography>

          {/* 右側: Instagramアイコン */}
          <Box>
            <IconButton
              component="a"
              href="https://www.instagram.com/filatelier_azumiyu/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

