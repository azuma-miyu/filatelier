from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Product, User
from datetime import datetime

products_bp = Blueprint('products', __name__)

def require_admin():
    """管理者権限チェック"""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': '管理者権限が必要です'}), 403
    return None


@products_bp.route('', methods=['GET'])
def get_products():
    """商品一覧取得"""
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([p.to_dict() for p in products]), 200


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """商品詳細取得"""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': '商品が見つかりません'}), 404
    
    return jsonify(product.to_dict()), 200


@products_bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    """商品作成（管理者のみ）"""
    error_response = require_admin()
    if error_response:
        return error_response
    
    data = request.get_json()
    
    # バリデーション
    if not data or not data.get('name') or not data.get('price'):
        return jsonify({'error': '商品名と価格が必要です'}), 400
    
    product = Product(
        name=data['name'],
        price=data['price'],
        description=data.get('description', ''),
        image_url=data.get('imageUrl', ''),
        stock=data.get('stock', 0),
        category=data.get('category', '')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201


@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """商品更新（管理者のみ）"""
    error_response = require_admin()
    if error_response:
        return error_response
    
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': '商品が見つかりません'}), 404
    
    data = request.get_json()
    
    # 更新
    if 'name' in data:
        product.name = data['name']
    if 'price' in data:
        product.price = data['price']
    if 'description' in data:
        product.description = data['description']
    if 'imageUrl' in data:
        product.image_url = data['imageUrl']
    if 'stock' in data:
        product.stock = data['stock']
    if 'category' in data:
        product.category = data['category']
    
    product.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify(product.to_dict()), 200


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """商品削除（管理者のみ）"""
    error_response = require_admin()
    if error_response:
        return error_response
    
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': '商品が見つかりません'}), 404
    
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': '商品を削除しました'}), 200


