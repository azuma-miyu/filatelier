# Flask Backend - ECサイトAPI

## セットアップ

### 1. 仮想環境作成

```bash
python -m venv venv
```

### 2. 仮想環境アクティベート

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. 依存関係インストール

```bash
pip install -r requirements.txt
```

### 4. 環境変数設定

`.env.example`を`.env`にコピーして編集（既に作成済み）

### 5. 初期データ投入

```bash
python seed_data.py
```

### 6. サーバー起動

```bash
python app.py
```

サーバーは http://localhost:5000 で起動します

## APIエンドポイント

### 認証
- `POST /api/auth/register` - 新規登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/me` - 現在のユーザー取得

### 商品
- `GET /api/products` - 商品一覧
- `GET /api/products/<id>` - 商品詳細
- `POST /api/products` - 商品作成（管理者）
- `PUT /api/products/<id>` - 商品更新（管理者）
- `DELETE /api/products/<id>` - 商品削除（管理者）

### 注文
- `POST /api/orders` - 注文作成
- `GET /api/orders` - 自分の注文一覧

### 決済
- `POST /api/stripe/create-payment-intent` - Payment Intent作成（モック）

## テストアカウント

**一般ユーザー:**
- Email: `user@example.com`
- Password: `password123`

**管理者:**
- Email: `admin@admin.com`
- Password: `admin123`

## データベース

SQLiteを使用。`app.db`ファイルに保存されます。

## 開発

デバッグモードで起動（ファイル変更時に自動リロード）:
```bash
python app.py
```


