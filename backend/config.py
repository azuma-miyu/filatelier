import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Flask設定クラス"""
    
    # Flask基本設定
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # データベース設定
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT設定
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # 管理者設定
    ADMIN_EMAIL_DOMAIN = os.getenv('ADMIN_EMAIL_DOMAIN', '@admin.com')
    
    # CORS設定
    CORS_ORIGINS = ['http://localhost:3000']
    
    # Stripe設定
    STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
    STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY', '')


