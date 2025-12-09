"""Gunicorn設定ファイル"""
import os
import multiprocessing

# ワーカー設定
workers = int(os.getenv('GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1))
worker_class = 'sync'
worker_connections = 1000
timeout = 30
keepalive = 2

# バインド設定
bind = '0.0.0.0:5000'

# ログ設定
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# プロセス設定
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# リロード設定（開発環境のみ）
reload = os.getenv('FLASK_ENV') == 'development'

# 高度な設定
max_requests = 1000
max_requests_jitter = 50
graceful_timeout = 30

