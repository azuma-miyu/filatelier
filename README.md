# かぎ針編みハンドメイドショップ

Pythonのバックエンド（Flask）とNext.jsのフロントエンドで構築した、かぎ針編みのハンドメイド作品を販売するECサイトです。

## 🎯 技術スタック

**バックエンド:**
- Flask 3.0
- SQLite（開発環境）
- Flask-JWT-Extended（認証）
- SQLAlchemy（ORM）

**フロントエンド:**
- Next.js 16 (App Router)
- React 19
- Material-UI
- Axios（API通信）
- JavaScript (JSX)

## 📁 プロジェクト構造

```
/backend          - Flask API サーバー
  /app
    /models      - データモデル
    /routes      - APIエンドポイント
  app.py         - アプリケーション起動
  seed_data.py   - 初期データ投入

/app              - Next.js アプリケーション
  /(auth)/login  - ログインページ
  /products      - 商品一覧
  /cart          - カート
  /checkout      - 決済
  /admin/products - 商品管理（管理者）

/components       - Reactコンポーネント
/contexts        - Context API
/lib/api         - API通信クライアント
```

## 🚀 クイックスタート

### 前提条件
- Python 3.8以上
- Node.js 14以上
- npm または yarn

### 1. バックエンドのセットアップ

```bash
# backendディレクトリへ移動
cd backend

# 仮想環境作成（Windows）
python -m venv venv
venv\Scripts\activate

# または Mac/Linux
python -m venv venv
source venv/bin/activate

# 依存関係インストール
pip install -r requirements.txt

# 初期データ投入
python seed_data.py

# サーバー起動
python app.py
```

バックエンドは **http://localhost:5000** で起動します

### 2. フロントエンドのセットアップ

**別のターミナルを開いて:**

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

フロントエンドは **http://localhost:3000** で自動的に開きます

## 👤 テストアカウント

### 一般ユーザー
- **Email**: `user@example.com`
- **Password**: `password123`

### 管理者
- **Email**: `admin@admin.com`
- **Password**: `admin123`

## 🎨 主な機能

### 顧客向け機能
- ✅ ユーザー登録・ログイン（JWT認証）
- ✅ 商品一覧表示（かぎ針編みハンドメイド作品）
- ✅ カート機能（追加・削除・数量変更）
- ✅ モック決済
- ✅ 注文履歴

### 管理者向け機能
- ✅ 商品管理（CRUD操作）
- ✅ 在庫管理（ハンドメイド作品の在庫管理）
- ✅ 商品画像設定（URL）

## 📡 API エンドポイント

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

## 💾 データベース

### SQLite（開発環境）
- ファイルベースのデータベース（`backend/app.db`）
- セットアップ不要
- 初期データは`seed_data.py`で投入

### テーブル構成
- `users` - ユーザー情報
- `products` - 商品情報
- `orders` - 注文情報
- `order_items` - 注文明細

## 🔄 モックデータについて

**バックエンドが起動していない場合や、DBに商品がない場合でも、フロントエンドではモックデータが自動的に表示されます。**

- モックデータは`lib/mock/products.js`に定義されています
- 8つのサンプル商品が含まれています
- API接続に失敗した場合や商品が空の場合、自動的にモックデータを使用します
- バックエンドのDBをセットアップすると、実際のデータが優先的に表示されます

**モックデータ使用中は、商品一覧ページに警告メッセージが表示されます。**

## 🔐 認証フロー

1. ユーザーがログイン
2. FlaskがJWTトークンを発行
3. Next.jsがlocalStorageに保存
4. 以降のリクエストにトークンを自動付与（axiosインターセプター）

## 🛒 決済フロー（モック）

1. カートから決済ページへ
2. Flask APIでPayment Intent作成（モック）
3. カード情報入力（モック）
4. 注文をデータベースに保存
5. **在庫を自動減算**
6. カートをクリア
7. 完了ページ表示

## 📱 画面一覧

| ページ | URL | 説明 |
|--------|-----|------|
| 商品一覧 | `/products` | 全ての商品を表示 |
| カート | `/cart` | カート内容の確認・編集 |
| 決済 | `/checkout` | 決済情報入力 |
| ログイン | `/login` | ログイン・新規登録 |
| 商品管理 | `/admin/products` | 商品の管理（管理者）|
| 商品追加 | `/admin/products/new` | 新規商品追加（管理者）|
| 商品編集 | `/admin/products/:id/edit` | 商品編集（管理者）|

## 🐛 トラブルシューティング

### バックエンドが起動しない
```bash
# 仮想環境がアクティブか確認
which python  # Mac/Linux
where python  # Windows

# 依存関係を再インストール
pip install -r requirements.txt
```

### フロントエンドが起動しない
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules && del package-lock.json  # Windows
npm install
```

### APIに接続できない
- バックエンドが起動しているか確認（http://localhost:5000）
- `.env.local`の`NEXT_PUBLIC_API_URL`が正しく設定されているか確認
- CORSエラーの場合、Flask-CORSが正しく設定されているか確認

### データベースエラー
```bash
# データベースをリセット
cd backend
rm app.db
python seed_data.py
```

## 🔧 開発のヒント

### バックエンド開発
- `app.py`の`debug=True`で自動リロード
- SQLAlchemy ORMでクエリ実行
- `@jwt_required()`デコレータで認証保護

### フロントエンド開発
- Material-UIコンポーネント活用
- Context APIで状態管理
- axiosインターセプターで自動認証

## 📦 本番デプロイ

### バックエンド
- **推奨**: Heroku, Railway, Render
- PostgreSQLへの切り替えを推奨
- 環境変数の設定を忘れずに

### フロントエンド
- **推奨**: Vercel, Netlify
- `npm run build`でビルド
- `NEXT_PUBLIC_API_URL`を本番APIに設定

## 📄 ライセンス

MIT

---

**開発を楽しんでください！** 🚀
