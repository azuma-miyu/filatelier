from flask import Blueprint, request, jsonify
import time
import random
import string

stripe_bp = Blueprint('stripe', __name__)

def generate_mock_secret():
    """モックclientSecretを生成"""
    timestamp = int(time.time())
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=7))
    return f"mock_pi_{timestamp}_secret_{random_str}"


@stripe_bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """Payment Intent作成（モック）"""
    data = request.get_json()
    
    # バリデーション
    if not data or not data.get('amount'):
        return jsonify({'error': '金額が必要です'}), 400
    
    amount = data['amount']
    
    # 金額チェック
    if amount < 50:
        return jsonify({'error': '無効な金額です'}), 400
    
    # モックclientSecret生成
    client_secret = generate_mock_secret()
    
    return jsonify({
        'clientSecret': client_secret
    }), 200


