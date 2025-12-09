# デプロイメントガイド

このドキュメントは、Oracle Cloud ARM インスタンスへのDockerを使った本番環境デプロイ手順を説明します。

## 前提条件

- ✅ Oracle Cloud ARM インスタンスが起動している
- ✅ Dockerがインストールされている
- ✅ GitHubにソースコードがプッシュされている
- ドメイン名を取得している（SSL証明書用）

## デプロイ手順

### 1. サーバーにSSH接続

```bash
ssh ubuntu@<サーバーのIPアドレス>
```

### 2. ソースコードをクローン

```bash
cd ~
git clone https://github.com/<あなたのユーザー名>/<リポジトリ名>.git
cd <リポジトリ名>
```

### 3. 環境変数ファイルの設定

`.env.production`ファイルを編集して本番環境用の設定を行います。

```bash
cp .env.production .env
nano .env
```

**必ず変更すべき項目:**

1. **POSTGRES_PASSWORD**: セキュアなパスワードに変更
2. **SECRET_KEY**: ランダムな文字列を生成して設定
3. **JWT_SECRET_KEY**: ランダムな文字列を生成して設定
4. **CORS_ORIGINS**: 実際のドメイン名に変更
5. **NEXT_PUBLIC_API_URL**: 実際のドメイン名に変更

**ランダムキー生成例:**

```bash
# SECRET_KEY生成
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# JWT_SECRET_KEY生成
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Nginx設定の更新

`nginx/nginx.conf`を編集して、`your-domain.com`を実際のドメイン名に変更します。

```bash
nano nginx/nginx.conf
```

変更箇所（全4箇所）:
- `server_name your-domain.com www.your-domain.com;` (2箇所)
- `ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;`
- `ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;`

### 5. SSL証明書の取得（初回のみ）

#### 5.1 一時的にHTTPのみでNginxを起動

`nginx/nginx.conf`のHTTPS部分（22行目以降）をコメントアウトします。

```bash
nano nginx/nginx.conf
```

以下のように、HTTP設定のみ残します:

```nginx
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:5000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 5.2 Dockerコンテナを起動

```bash
docker compose up -d
```

#### 5.3 SSL証明書を取得

```bash
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d your-domain.com \
  -d www.your-domain.com
```

#### 5.4 Nginx設定を元に戻す

`nginx/nginx.conf`を元のHTTPS設定に戻します。

```bash
git checkout nginx/nginx.conf
nano nginx/nginx.conf  # ドメイン名を再度変更
```

#### 5.5 Nginxを再起動

```bash
docker compose restart nginx
```

### 6. データベースの初期化

#### 6.1 マイグレーションの実行

```bash
docker compose exec backend flask db upgrade
```

#### 6.2 初期データの投入

```bash
docker compose exec backend python seed_data.py
```

これで以下のテストアカウントが作成されます:
- **一般ユーザー**: `user@example.com` / `password123`
- **管理者**: `admin@admin.com` / `admin123`

### 7. 動作確認

ブラウザで以下にアクセスして確認します:

- `https://your-domain.com` - フロントエンドが表示されるか
- `https://your-domain.com/api/products` - API が動作しているか

### 8. ログの確認

```bash
# 全コンテナのログを確認
docker compose logs

# 特定のコンテナのログを確認
docker compose logs backend
docker compose logs frontend
docker compose logs nginx

# リアルタイムでログを監視
docker compose logs -f
```

## 日常運用

### コンテナの起動・停止

```bash
# 起動
docker compose up -d

# 停止
docker compose down

# 再起動
docker compose restart

# 特定のコンテナだけ再起動
docker compose restart backend
```

### コードの更新

```bash
# 最新コードを取得
git pull

# コンテナを再ビルドして再起動
docker compose up -d --build
```

### データベースのバックアップ

```bash
# バックアップ
docker compose exec db pg_dump -U postgres ecshop > backup_$(date +%Y%m%d_%H%M%S).sql

# リストア
docker compose exec -T db psql -U postgres ecshop < backup_20231209_120000.sql
```

### SSL証明書の更新

SSL証明書は自動的に更新されますが、手動で更新する場合:

```bash
docker compose run --rm certbot renew
docker compose restart nginx
```

## トラブルシューティング

### コンテナが起動しない

```bash
# コンテナの状態確認
docker compose ps

# ログを確認
docker compose logs <コンテナ名>

# コンテナを再ビルド
docker compose up -d --build --force-recreate
```

### データベース接続エラー

```bash
# データベースコンテナが起動しているか確認
docker compose ps db

# データベースのログを確認
docker compose logs db

# データベースに直接接続してテスト
docker compose exec db psql -U postgres -d ecshop
```

### Nginxエラー

```bash
# Nginx設定のテスト
docker compose exec nginx nginx -t

# Nginxのログを確認
docker compose logs nginx
```

## セキュリティ対策

### ファイアウォール設定

```bash
# UFWが有効か確認
sudo ufw status

# 必要なポートのみ開放
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 定期的なセキュリティアップデート

```bash
# システムのアップデート
sudo apt update && sudo apt upgrade -y

# Dockerイメージのアップデート
docker compose pull
docker compose up -d --build
```

### パスワード変更

本番環境では定期的にパスワードを変更してください:

1. `.env`ファイルのパスワードを変更
2. データベースパスワードを変更:
   ```bash
   docker compose exec db psql -U postgres -c "ALTER USER postgres PASSWORD 'new-password';"
   ```
3. コンテナを再起動:
   ```bash
   docker compose down
   docker compose up -d
   ```

## 監視とメンテナンス

### リソース使用状況の確認

```bash
# コンテナのリソース使用状況
docker stats

# ディスク使用状況
df -h
```

### ログローテーション

Dockerのログが大きくなりすぎないように、`/etc/docker/daemon.json`を設定:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

設定後、Dockerを再起動:

```bash
sudo systemctl restart docker
```

## 参考リンク

- [Docker Compose リファレンス](https://docs.docker.com/compose/)
- [Let's Encrypt ドキュメント](https://letsencrypt.org/docs/)
- [Nginx ドキュメント](https://nginx.org/en/docs/)
- [PostgreSQL ドキュメント](https://www.postgresql.org/docs/)

