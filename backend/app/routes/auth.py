from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import db, User
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """新規ユーザー登録"""
    data = request.get_json()
    
    # バリデーション
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'メールアドレスとパスワードが必要です'}), 400
    
    email = data['email']
    password = data['password']
    display_name = data.get('displayName', '')
    
    # パスワード長チェック
    if len(password) < 6:
        return jsonify({'error': 'パスワードは6文字以上である必要があります'}), 400
    
    # 既存ユーザーチェック
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'このメールアドレスは既に使用されています'}), 400
    
    # 管理者判定
    is_admin = email.endswith(Config.ADMIN_EMAIL_DOMAIN)
    
    # ユーザー作成
    user = User(
        email=email,
        display_name=display_name,
        is_admin=is_admin
    )
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    # JWTトークン発行
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """ログイン"""
    data = request.get_json()
    
    # バリデーション
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'メールアドレスとパスワードが必要です'}), 400
    
    email = data['email']
    password = data['password']
    
    # ユーザー検索
    user = User.query.filter_by(email=email).first()
    
    # ユーザーが存在しないまたはパスワードが間違っている
    if not user or not user.check_password(password):
        return jsonify({'error': 'メールアドレスまたはパスワードが間違っています'}), 401
    
    # JWTトークン発行
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """現在のユーザー情報取得"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'ユーザーが見つかりません'}), 404
    
    return jsonify(user.to_dict()), 200


