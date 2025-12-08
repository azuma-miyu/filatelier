from flask import Flask
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
    JWTManager(app)
    Migrate(app, db)
    
    # ブループリント登録
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.orders import orders_bp
    from app.routes.stripe_mock import stripe_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(stripe_bp, url_prefix='/api/stripe')
    
    # データベーステーブル作成
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)


