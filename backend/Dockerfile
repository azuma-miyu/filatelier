FROM python:3.11-slim

WORKDIR /app

# システム依存パッケージのインストール
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Python依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY . .

# 環境変数
ENV FLASK_APP=app.py
ENV PYTHONUNBUFFERED=1

# ポート公開
EXPOSE 5000

# Gunicornで起動
CMD ["gunicorn", "--config", "gunicorn.conf.py", "wsgi:app"]

