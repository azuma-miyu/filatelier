# トラブルシューティングガイド

## 🔴 決済ページで「決済の準備に失敗しました」エラー

### 症状
- チェックアウトページにアクセスすると「決済の準備に失敗しました」というエラーが表示される
- ブラウザのコンソールに`Error: 決済の準備に失敗しました`と表示される
- バックエンドログに`422`エラーが記録される

### 原因
JWT認証トークンが無効または期限切れです。以下のいずれかが原因：

1. **SECRET_KEYが変更された**（バックエンド再起動時など）
2. **トークンの有効期限が切れた**（24時間後）
3. **古いセッションのトークンが残っている**

### 解決方法

#### 方法1: ブラウザの開発者ツールでクリア（推奨）

1. **F12キー**を押して開発者ツールを開く
2. **Application**タブ（Chromeの場合）または**ストレージ**タブ（Firefoxの場合）をクリック
3. 左側メニューの**Local Storage** → `http://localhost:3000`を展開
4. **全てのアイテムを選択**して**Deleteキー**を押す
5. ページを**リロード（F5キー）**
6. **ログインページ**で再度ログイン

#### 方法2: コンソールでクリア

1. **F12キー**を押して開発者ツールを開く
2. **Console**タブを選択
3. 以下のコマンドを入力してEnterキーを押す：

```javascript
localStorage.clear();
location.reload();
```

4. **ログインページ**で再度ログイン

#### 方法3: シークレットモード/プライベートブラウジング

1. ブラウザの**シークレットモード**（Ctrl+Shift+N）または**プライベートブラウジング**を開く
2. `http://localhost:3000`にアクセス
3. ログイン

---

## 🔴 `/api/auth/me`で422エラー

### 症状
- ページをリロードすると認証エラーが出る
- コンソールに`Request failed with status code 422`と表示される

### 原因
上記と同じ（JWT認証トークンが無効）

### 解決方法
上記の「決済ページエラー」と同じ手順でlocalStorageをクリアしてください。

---

## 🟡 商品画像が表示されない

### 症状
- 商品一覧で画像が表示されない
- 画像の代わりにグレーのボックスが表示される

### 原因
画像ファイルが`public/images/products/`に存在しない

### 解決方法

1. 画像を`public/images/products/`フォルダに配置
2. ファイル名を確認（例: `seal.png`, `bear.png`など）
3. `backend/seed_data.py`と`lib/mock/products.js`の`imageUrl`を確認

---

## 🟡 Stripeの決済フォームが表示されない

### 症状
- チェックアウトページで決済フォームが表示されない
- ローディング表示が続く

### 原因
Stripe公開キーが無効、またはStripe.jsの読み込みに失敗

### 解決方法

#### モックモードの場合（デフォルト）

`.env.local`ファイルを確認：

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_dummy_replace_with_real_key
```

→ 「dummy」が含まれていればモックモードで動作します。

#### 本物のStripeを使う場合

1. https://stripe.com でアカウント作成
2. ダッシュボードから**テストモード**のAPIキーを取得
3. `.env.local`を更新：

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

4. `backend/.env`も更新：

```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

5. フロントエンドを再起動（Ctrl+C → `npm run dev`）

---

## 🟡 データベースエラー（`database is locked`）

### 症状
- バックエンドで`database is locked`エラーが出る
- APIリクエストがタイムアウトする

### 原因
SQLiteは同時書き込みに弱いため、複数のリクエストが同時に来るとロックされる

### 解決方法

#### 一時的な対応
バックエンドサーバーを再起動：

```powershell
# Ctrl+C で停止
cd backend
.\venv\Scripts\Activate.ps1
python -m flask run
```

#### 恒久的な対応
PostgreSQLを使用する（本番環境では必須）

---

## 🟡 バックエンドが起動しない

### 症状
- `python -m flask run`でエラーが出る
- `ModuleNotFoundError`が表示される

### 原因
仮想環境が有効化されていない、または依存関係がインストールされていない

### 解決方法

```powershell
cd backend

# 仮想環境有効化
.\venv\Scripts\Activate.ps1

# プロンプトに(venv)が表示されることを確認

# 依存関係再インストール
pip install -r requirements.txt

# Flaskサーバー起動
python -m flask run
```

---

## 🟡 フロントエンドが起動しない

### 症状
- `npm run dev`でエラーが出る
- `ELIFECYCLE`エラーが表示される

### 原因
node_modulesが壊れている、またはポート3000が既に使用されている

### 解決方法

#### 方法1: node_modulesを再インストール

```powershell
# node_modules削除
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# 再インストール
npm install

# 起動
npm run dev
```

#### 方法2: ポートを変更

`package.json`を編集：

```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

---

## 📋 よくある質問

### Q: localStorageをクリアするとカートの中身も消える？

**A:** はい、消えます。カートデータもlocalStorageに保存されているため、クリアすると全て削除されます。

### Q: 毎回localStorageをクリアしないとダメ？

**A:** いいえ。一度正しいトークンでログインすれば、24時間は有効です。
ただし、バックエンドのSECRET_KEYを変更した場合は再度クリアが必要です。

### Q: 本番環境でも同じ問題が起こる？

**A:** いいえ。本番環境ではSECRET_KEYが固定されているため、この問題は起こりません。
ただし、トークンの有効期限（24時間）が切れた場合は再ログインが必要です。

### Q: モック決済で実際の決済はできる？

**A:** いいえ。モック決済は開発用のダミーです。
実際の決済を試すには、Stripeアカウントを作成して本物のAPIキーを設定する必要があります。

---

## 🆘 それでも解決しない場合

1. **ブラウザのキャッシュをクリア**
2. **シークレットモード/プライベートブラウジングで試す**
3. **バックエンドとフロントエンドを両方再起動**
4. **バックエンドのログを確認**（`terminals/5.txt`）
5. **ブラウザのコンソールエラーをスクリーンショット**

それでも解決しない場合は、エラーメッセージの詳細を確認してください。

