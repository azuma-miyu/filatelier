from datetime import datetime
from app.models import db
import bcrypt

class User(db.Model):
    """ユーザーモデル"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(100))
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # リレーション
    orders = db.relationship('Order', backref='user', lazy=True)
    
    def set_password(self, password):
        """パスワードをハッシュ化して保存"""
        self.password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
    
    def check_password(self, password):
        """パスワード検証"""
        return bcrypt.checkpw(
            password.encode('utf-8'),
            self.password_hash.encode('utf-8')
        )
    
    def to_dict(self):
        """辞書形式に変換"""
        return {
            'id': self.id,
            'email': self.email,
            'display_name': self.display_name,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


