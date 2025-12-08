'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/contexts/AuthContext';
import { productsAPI } from '@/lib/api/client';
import Header from '@/components/layout/Header';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/products');
      return;
    }

    if (user && isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin, authLoading, router]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error('商品取得エラー:', err);
      setError('商品を取得できませんでした');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setDeleting(true);
    try {
      await productsAPI.delete(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('商品削除エラー:', err);
      setError('商品を削除できませんでした');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            商品管理
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/products/new')}
          >
            新規商品追加
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {products.length === 0 ? (
          <Alert severity="info">商品が登録されていません</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>画像</TableCell>
                  <TableCell>商品名</TableCell>
                  <TableCell>価格</TableCell>
                  <TableCell>カテゴリ</TableCell>
                  <TableCell>在庫</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box
                        component="img"
                        src={product.imageUrl || '/placeholder-product.jpg'}
                        alt={product.name}
                        sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>¥{product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
          <DialogTitle>商品を削除しますか？</DialogTitle>
          <DialogContent>
            <Typography>
              「{productToDelete?.name}」を削除します。この操作は取り消せません。
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              キャンセル
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleting}
            >
              {deleting ? <CircularProgress size={24} /> : '削除'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

