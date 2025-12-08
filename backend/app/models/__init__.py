from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem

__all__ = ['db', 'User', 'Product', 'Order', 'OrderItem']


