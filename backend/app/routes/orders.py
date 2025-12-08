from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Order, OrderItem, Product

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    """注文作成"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # バリデーション
    if not data or not data.get('items') or not data.get('total'):
        return jsonify({'error': '注文データが不正です'}), 400
    
    # 注文作成
    order = Order(
        user_id=user_id,
        total=data['total'],
        status='paid',
        stripe_payment_intent_id=data.get('stripePaymentIntentId')
    )
    db.session.add(order)
    db.session.flush()  # IDを取得するためflush
    
    # 注文明細作成と在庫減算
    for item_data in data['items']:
        # 商品取得
        product = Product.query.get(item_data['productId'])
        if not product:
            db.session.rollback()
            return jsonify({'error': f'商品ID {item_data["productId"]} が見つかりません'}), 404
        
        # 在庫チェック
        if product.stock < item_data['quantity']:
            db.session.rollback()
            return jsonify({'error': f'{product.name} の在庫が不足しています'}), 400
        
        # 在庫減算
        product.stock -= item_data['quantity']
        
        # 注文明細作成
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data['productId'],
            product_name=item_data['productName'],
            quantity=item_data['quantity'],
            price=item_data['price']
        )
        db.session.add(order_item)
    
    db.session.commit()
    
    return jsonify(order.to_dict()), 201


@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    """自分の注文一覧取得"""
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    
    return jsonify([o.to_dict() for o in orders]), 200


@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """注文詳細取得"""
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
    if not order:
        return jsonify({'error': '注文が見つかりません'}), 404
    
    return jsonify(order.to_dict()), 200


