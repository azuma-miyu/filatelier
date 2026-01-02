# ローカル開発環境セットアップガイド

このプロジェクトは、ローカル開発環境ではSQLite、本番環境（Oracle ARM）ではPostgreSQLを使用します。

## 📋 必要なもの

- **Node.js** 18以上
- **Python** 3.11以上
- **Git**

### オプション（PostgreSQLをローカルでも使いたい場合）
- **Docker Desktop** （PostgreSQL用）

---

## 🚀 初回セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd cursor
```

### 2. フロントエンドのセットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数ファイルを作成（既存の場合はスキップ）
# .env.localが存在することを確認
```

### 3. バックエンドのセットアップ

```bash
cd backend

# 仮想環境の作成
python -m venv venv

# 仮想環境の有効化
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Windows CMD:
.\venv\Scripts\activate.bat

# Mac/Linux:
source venv/bin/activate

# 依存関係のインストール
pip install -r requirements.txt

# データベースの初期化
python -c "from app import create_app; app = create_app(); app.app_context().push(); from app.models import db; db.create_all()"

# サンプルデータの投入（オプション）
python seed_data.py
```

---

## 💻 開発サーバーの起動

### ターミナル1: バックエンド

```bash
cd backend
.\venv\Scripts\Activate.ps1  # 仮想環境有効化
python -m flask run --port=5000
```

### ターミナル2: フロントエンド

```bash
npm run dev
```

---

## 🌐 アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:5000/api
- **データベース**: SQLite（`backend/app.db`ファイル）

---

## 🗄️ データベース操作

### SQLiteデータベースの確認

```bash
# SQLiteコマンドラインツールでアクセス（要インストール）
sqlite3 backend/app.db

# よく使うコマンド
.tables          # テーブル一覧
.schema users    # usersテーブルの構造
SELECT * FROM users;  # ユーザー一覧
.quit            # 終了
```

### データベースのリセット

```bash
# 方法1: ファイル削除
rm backend/app.db  # Mac/Linux
del backend\app.db  # Windows

# 方法2: Pythonで再作成
cd backend
python -c "from app import create_app; app = create_app(); app.app_context().push(); from app.models import db; db.drop_all(); db.create_all()"
python seed_data.py
```

---

## 🔧 Stripe決済のテスト

### 1. Stripeアカウントの作成

1. https://stripe.com にアクセス
2. アカウント登録（無料）
3. ダッシュボードの「開発者」→「APIキー」からテストキーを取得

### 2. 環境変数の設定

#### フロントエンド（`.env.local`）

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx...
```

#### バックエンド（`backend/.env`）

```bash
STRIPE_SECRET_KEY=sk_test_xxxxx...
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx...
```

### 3. テストカード番号

```
カード番号: 4242 4242 4242 4242
有効期限: 任意の未来の日付（例: 12/34）
CVC: 任意の3桁（例: 123）
郵便番号: 任意
```

---

## 🐛 トラブルシューティング

### データベースエラー（`database is locked`）

SQLiteは同時書き込みに弱いため、このエラーが出ることがあります。

```bash
# 解決方法: バックエンドサーバーを再起動
# Ctrl+C で停止してから再度起動
python -m flask run
```

### データベースファイルが見つからない

```bash
# app.dbを作成
cd backend
python -c "from app import create_app; app = create_app(); app.app_context().push(); from app.models import db; db.create_all()"
```

### Pythonのバージョンが古い

```bash
# Pythonバージョン確認
python --version

# Python 3.11以上が必要
# インストール: https://www.python.org/downloads/
```

---

## 📦 本番環境へのデプロイ

本番環境（Oracle ARM）では`docker-compose.yml`を使用します。

```bash
# Oracle ARMインスタンス上で
docker compose up -d
```

詳細は`README.md`を参照してください。

---

## 🔄 環境の違い

| | ローカル開発 | 本番（Oracle ARM） |
|---|------------|-------------------|
| **DB種類** | SQLite | PostgreSQL (Docker) |
| **DBファイル/名** | `backend/app.db` | `ecshop` |
| **フロントエンド** | `npm run dev` | Docker (Next.js build) |
| **バックエンド** | `flask run` | Docker (gunicorn) |
| **メモリ使用量** | 低い | 通常 |

## ⚠️ SQLiteとPostgreSQLの違いによる注意点

### 問題が起きにくいコード

✅ **推奨する書き方**：

```python
# 日付型はdatetimeモジュールを使用
from datetime import datetime
created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Boolean型を使用（SQLiteでも動作）
is_admin = db.Column(db.Boolean, default=False)

# トランザクションを明示的に管理
try:
    db.session.add(user)
    db.session.commit()
except Exception as e:
    db.session.rollback()
    raise
```

❌ **避けるべき書き方**：

```python
# データベース固有の関数
created_at = db.Column(db.DateTime, server_default=db.func.now())  # PostgreSQL固有

# 複雑なJOIN・サブクエリ（動作が異なる可能性）
# 本番デプロイ前にテスト必須
```

### 本番デプロイ前のチェック

```bash
# Oracle ARMサーバー上で必ずテスト
docker compose up -d
# 全機能を手動テスト
```

---

## 📚 参考リンク

- [Flask ドキュメント](https://flask.palletsprojects.com/)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Stripe ドキュメント](https://stripe.com/docs)
- [PostgreSQL ドキュメント](https://www.postgresql.org/docs/)

