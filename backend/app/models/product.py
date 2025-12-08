from datetime import datetime
from app.models import db

class Product(db.Model):
    """商品モデル"""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.Text)  # Base64画像を保存
    stock = db.Column(db.Integer, default=0)
    category = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """辞書形式に変換"""
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'imageUrl': self.image_url,
            'stock': self.stock,
            'category': self.category,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }


