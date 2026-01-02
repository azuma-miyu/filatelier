"""Flaskアプリケーションパッケージ"""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config
from app.models import db

def create_app(config_class=Config):
    """Flaskアプリケーションファクトリ"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # 拡張機能の初期化
    db.init_app(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    jwt = JWTManager(app)
    Migrate(app, db)
    
    # JWTエラーハンドラー
    from flask import jsonify as flask_jsonify
    
    @jwt.unauthorized_loader
    def unauthorized_callback(error_string):
        print(f'JWT unauthorized: {error_string}')
        return flask_jsonify({'error': 'Token required'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        print(f'JWT invalid token: {error_string}')
        return flask_jsonify({'error': 'Invalid token'}), 422
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        print(f'JWT expired: {jwt_data}')
        return flask_jsonify({'error': 'Token expired'}), 401
    
    # ブループリント登録
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.orders import orders_bp
    from app.routes.stripe_payment import stripe_payment_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(stripe_payment_bp, url_prefix='/api/stripe')
    
    # データベーステーブル作成
    with app.app_context():
        db.create_all()
    
    return app

