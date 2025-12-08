from datetime import datetime
from app.models import db

class Order(db.Model):
    """注文モデル"""
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, paid, shipped, delivered, cancelled
    stripe_payment_intent_id = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # リレーション
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """辞書形式に変換"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'total': self.total,
            'status': self.status,
            'stripePaymentIntentId': self.stripe_payment_intent_id,
            'items': [item.to_dict() for item in self.items],
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }


class OrderItem(db.Model):
    """注文明細モデル"""
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_name = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    
    # リレーション
    product = db.relationship('Product', backref='order_items')
    
    def to_dict(self):
        """辞書形式に変換"""
        return {
            'id': self.id,
            'orderId': self.order_id,
            'productId': self.product_id,
            'productName': self.product_name,
            'quantity': self.quantity,
            'price': self.price
        }


