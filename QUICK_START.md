# 🚀 クイックスタートガイド

## Flask + Next.js ECサイトの起動方法

### ステップ1: バックエンド起動

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python seed_data.py
python app.py
```

バックエンドは **http://localhost:5000** で起動します

### ステップ2: フロントエンド起動

**別のターミナルで:**

```bash
npm install
npm run dev
```

フロントエンドは **http://localhost:3000** で自動的に開きます

## 👤 テストアカウント

**一般ユーザー:**
- Email: `user@example.com`
- Password: `password123`

**管理者:**
- Email: `admin@admin.com`
- Password: `admin123`

## 🎯 すぐに試せる機能

1. **商品を見る**: http://localhost:3000/products
2. **カートに追加**: 商品カードの「カートに追加」ボタン
3. **ログイン**: http://localhost:3000/login
4. **決済**: カートから「決済へ進む」
5. **管理画面**: 管理者でログイン後、ヘッダーの「管理画面」ボタン

## ⚠️ 注意事項

- バックエンドが起動していることを確認してください
- 環境変数（`.env.local`）が正しく設定されているか確認してください
- CORSエラーが出る場合は、FlaskのCORS設定を確認してください

## 🐛 トラブルシューティング

### バックエンドが起動しない
```bash
# 仮想環境を確認
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### フロントエンドが起動しない
```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```

### API接続エラー
- バックエンドが http://localhost:5000 で起動しているか確認
- `.env.local`の`NEXT_PUBLIC_API_URL`を確認

---

**楽しんでください！** 🎉

