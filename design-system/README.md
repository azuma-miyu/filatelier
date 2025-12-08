# Fil Atelier デザインシステム

このディレクトリには、デザインシステムの情報が含まれています。

## 📋 含まれるファイル

### `component-specs.md`
コンポーネントの仕様書

## 🎨 カラーパレット

### Primary（プライマリカラー）
- **Main**: `#1976d2` - ボタン、リンクなど
- **Light**: `#42a5f5` - ホバー状態
- **Dark**: `#1565c0` - アクティブ状態

### Secondary（セカンダリカラー）
- **Main**: `#dc004e` - アクセントカラー
- **Light**: `#ff5983`
- **Dark**: `#9a0036`

## 📐 スペーシングシステム

8pxベースのグリッドシステムを使用:
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- XXL: 48px

## 🔤 タイポグラフィ

### フォントファミリー
- **Primary**: Geist Sans
- **Monospace**: Geist Mono

### 見出し
- H1: 2.5rem (40px) / Font Weight: 500
- H2: 2rem (32px) / Font Weight: 500
- H3: 1.75rem (28px) / Font Weight: 500
- H4: 1.5rem (24px) / Font Weight: 500

### 本文
- Body 1: 1rem (16px) / Font Weight: 400
- Body 2: 0.875rem (14px) / Font Weight: 400

## 📱 ブレークポイント

- **XS**: 0px（モバイル）
- **SM**: 600px（タブレット）
- **MD**: 900px（小型デスクトップ）
- **LG**: 1200px（デスクトップ）
- **XL**: 1536px（大型デスクトップ）

## 🧩 主要コンポーネント

### Button
- Small: 32px高さ
- Medium: 40px高さ（デフォルト）
- Large: 48px高さ
- Border Radius: 4px

### Card
- Padding: 16px
- Border Radius: 4px
- Elevation: 1（軽い影）

### TextField
- Height: 56px
- Border Radius: 4px

### AppBar（ヘッダー）
- Height: 64px
- Elevation: 4


## 📝 現在のコンポーネント一覧

1. **Header** (`components/layout/Header.jsx`)
   - AppBarコンポーネント
   - ナビゲーション、カート、ユーザーメニュー

2. **ProductCard** (`components/products/ProductCard.jsx`)
   - 商品カード表示
   - 画像、タイトル、価格、在庫表示

3. **ProductList** (`components/products/ProductList.jsx`)
   - 商品一覧グリッド（3カラム）

4. **LoginPage** (`app/(auth)/login/page.jsx`)
   - ログイン/新規登録フォーム

5. **CartItem** (`components/cart/CartItem.jsx`)
   - カート内商品表示


