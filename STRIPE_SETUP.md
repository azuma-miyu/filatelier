# 🎯 Stripe決済セットアップガイド

このガイドでは、Stripe決済を動作させるための手順を説明します。

---

## 📋 **セットアップ手順**

### **ステップ1: Stripeアカウント作成（5分）**

1. https://stripe.com/jp にアクセス
2. 「今すぐ始める」をクリック
3. メールアドレス、パスワードを入力して登録
4. ✅ **完全無料**（テストモードは永久無料、本番も売上がなければ0円）

---

### **ステップ2: APIキーを取得（2分）**

1. Stripeダッシュボードにログイン
2. 左メニューの「開発者」→「APIキー」をクリック
3. 画面右上が「テストモード」になっていることを確認
   - テストモード = 実際のお金は動かない（学習に最適）
4. 以下の2つのキーをコピー：
   - **公開可能キー** (`pk_test_...` で始まる)
   - **シークレットキー** (`sk_test_...` で始まる)

---

### **ステップ3: 環境変数を設定**

#### **ローカル開発環境（あなたのPC）**

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# フロントエンド設定
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe設定（テストモード）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_ここにあなたの公開キーを貼り付け
STRIPE_SECRET_KEY=sk_test_ここにあなたのシークレットキーを貼り付け
```

#### **本番環境（Oracle ARM）**

`.env.production` ファイルに追加（既存の内容に追記）：

```bash
# Stripe設定（テストモード）
STRIPE_SECRET_KEY=sk_test_ここにあなたのシークレットキーを貼り付け
STRIPE_PUBLISHABLE_KEY=pk_test_ここにあなたの公開キーを貼り付け
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_ここにあなたの公開キーを貼り付け
```

⚠️ **重要**: `.env.local` と `.env.production` はGitにコミットしない！
（`.gitignore` に既に追加されています）

---

### **ステップ4: 依存パッケージをインストール**

#### **バックエンド（Python）**

```bash
cd backend
pip install -r requirements.txt
```

#### **フロントエンド（Node.js）**

```bash
npm install
```

---

### **ステップ5: 動作確認（ローカル）**

#### **1. バックエンド起動**

```bash
cd backend
python wsgi.py
```

→ http://localhost:5000 で起動

#### **2. フロントエンド起動**

別のターミナルで：

```bash
npm run dev
```

→ http://localhost:3000 で起動

#### **3. 決済テスト**

1. http://localhost:3000 にアクセス
2. 商品をカートに追加
3. 「注文手続きへ」をクリック
4. **テストカード番号**を入力：

```
カード番号: 4242 4242 4242 4242
有効期限: 12/34（未来の日付ならなんでもOK）
CVC: 123（任意の3桁）
郵便番号: 123-4567（任意）
```

5. 「支払う」をクリック
6. 決済成功！

---

## 🧪 **テストカード番号一覧**

| カード番号 | 結果 | 用途 |
|-----------|------|------|
| `4242 4242 4242 4242` | ✅ 成功 | 正常な決済テスト |
| `4000 0000 0000 0002` | ❌ 失敗 | カード拒否エラー |
| `4000 0000 0000 9995` | ❌ 失敗 | 残高不足エラー |
| `4000 0027 6000 3184` | ✅ 成功（3Dセキュア） | 追加認証テスト |

詳細: https://stripe.com/docs/testing

---

## 🏭 **本番環境へのデプロイ**

### **1. Oracle ARMインスタンスで環境変数を設定**

```bash
cd /home/ubuntu/filatelier
nano .env.production
```

以下を追加：

```bash
STRIPE_SECRET_KEY=sk_test_あなたのシークレットキー
STRIPE_PUBLISHABLE_KEY=pk_test_あなたの公開キー
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_あなたの公開キー
```

保存して終了（Ctrl+X → Y → Enter）

### **2. Dockerコンテナを再ビルド**

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### **3. 動作確認**

https://filatelier.azumiyu.com にアクセスして決済テスト

---

## 🔐 **セキュリティ注意事項**

### ✅ **安全な実装**

- ✅ カード情報はあなたのサーバーを経由しない（Stripeに直接送信）
- ✅ バックエンドで決済を再検証（改ざん防止）
- ✅ 環境変数はGitにコミットしない
- ✅ シークレットキーは絶対に公開しない

### ❌ **やってはいけないこと**

- ❌ シークレットキーをフロントエンドで使用
- ❌ 環境変数をGitHubにpush
- ❌ フロントエンドの情報だけで注文を保存

---

## 💡 **トラブルシューティング**

### **問題1: 「Stripe設定が見つかりません」エラー**

**原因**: 環境変数が設定されていない

**解決策**:
1. `.env.local` ファイルが存在するか確認
2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` が正しく設定されているか確認
3. 開発サーバーを再起動（`npm run dev` を止めて再実行）

---

### **問題2: 「決済の準備に失敗しました」エラー**

**原因**: バックエンドのStripe設定が不正

**解決策**:
1. バックエンドの `.env` または環境変数に `STRIPE_SECRET_KEY` が設定されているか確認
2. APIキーが正しいか確認（`sk_test_` で始まる）
3. バックエンドのログを確認：`docker compose logs backend`

---

### **問題3: カード決済が失敗する**

**原因**: テストカード番号以外を使用している

**解決策**:
- テストモードでは **`4242 4242 4242 4242`** を使用
- 実際のカード番号はテストモードでは使えない

---

## 🎓 **学習リソース**

- Stripe公式ドキュメント: https://stripe.com/docs
- テストカード番号: https://stripe.com/docs/testing
- Stripe Elements: https://stripe.com/docs/stripe-js
- React Stripe.js: https://stripe.com/docs/stripe-js/react

---

## 💰 **料金について**

### **テストモード（学習中）**
- 費用: **0円**
- 期間: **無制限**

### **本番モード（実際の販売）**
- 初期費用: **0円**
- 月額費用: **0円**
- 決済手数料: **売上の3.6%のみ**
- 売上がなければ: **0円**

---

## ✅ **実装完了チェックリスト**

- [ ] Stripeアカウント作成
- [ ] APIキー取得
- [ ] `.env.local` 作成（ローカル）
- [ ] `npm install` 実行
- [ ] `pip install -r requirements.txt` 実行
- [ ] バックエンド起動確認
- [ ] フロントエンド起動確認
- [ ] テストカードで決済成功
- [ ] 注文がDBに保存されることを確認
- [ ] 在庫が減ることを確認

すべて完了したら、Stripe決済の実装は完璧です！ 🎉


