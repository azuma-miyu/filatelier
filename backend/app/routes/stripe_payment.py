"""Stripe決済API"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import stripe
import os

stripe_payment_bp = Blueprint('stripe_payment', __name__)

@stripe_payment_bp.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    """
    決済Intent作成
    
    説明:
    1. フロントエンドから決済金額を受け取る
    2. Stripe APIにPaymentIntentを作成依頼
    3. client_secretをフロントエンドに返す
    4. フロントエンドがこのclient_secretを使ってカード決済
    """
    try:
        print('=== PaymentIntent作成リクエスト受信 ===')
        
        # リクエストデータ取得
        data = request.get_json()
        print(f'リクエストデータ: {data}')
        amount = data.get('amount')  # 円単位
        print(f'金額: {amount}円')
        
        # バリデーション
        if not amount or amount <= 0:
            return jsonify({'error': '金額が無効です'}), 400
        
        # ログインユーザーID取得（文字列なので整数に変換）
        user_id = int(get_jwt_identity())
        
        # Stripe APIキー確認
        stripe_secret_key = current_app.config.get('STRIPE_SECRET_KEY', '')
        print(f'Stripe APIキー: {stripe_secret_key}')
        
        # 本物のStripeキーがある場合は実際のAPIを呼び出す
        if stripe_secret_key and stripe_secret_key.startswith('sk_') and not 'dummy' in stripe_secret_key.lower():
            stripe.api_key = stripe_secret_key
            
            # PaymentIntent作成（Stripe APIへのリクエスト）
            payment_intent = stripe.PaymentIntent.create(
                amount=int(amount),  # 円単位
                currency='jpy',      # 日本円
                metadata={
                    'user_id': user_id,  # 注文者情報
                    'integration_check': 'accept_a_payment'
                },
                # 自動決済方法を有効化
                automatic_payment_methods={
                    'enabled': True
                }
            )
            
            # client_secretをフロントエンドに返す
            return jsonify({
                'clientSecret': payment_intent.client_secret,
                'paymentIntentId': payment_intent.id
            }), 200
        else:
            # モックモード：ダミーのclient_secretを返す
            import uuid
            mock_payment_intent_id = f'pi_mock_{uuid.uuid4().hex[:24]}'
            mock_client_secret = f'{mock_payment_intent_id}_secret_{uuid.uuid4().hex[:32]}'
            
            print(f'⚠️  モック決済モード: amount={amount}円, user_id={user_id}')
            
            return jsonify({
                'clientSecret': mock_client_secret,
                'paymentIntentId': mock_payment_intent_id
            }), 200
        
    except stripe.error.StripeError as e:
        # Stripe APIエラー
        print(f'❌ Stripe APIエラー: {str(e)}')
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # その他のエラー
        import traceback
        print(f'❌ 決済準備エラー: {str(e)}')
        print(traceback.format_exc())
        return jsonify({'error': '決済の準備に失敗しました', 'detail': str(e)}), 500


@stripe_payment_bp.route('/verify-payment', methods=['POST'])
@jwt_required()
def verify_payment():
    """
    決済検証
    
    説明:
    フロントエンドから決済完了の通知を受けたら、
    Stripe APIに問い合わせて本当に決済が成功したか確認する
    （セキュリティのため、フロントエンドの情報だけを信用しない）
    """
    try:
        data = request.get_json()
        payment_intent_id = data.get('paymentIntentId')
        
        if not payment_intent_id:
            return jsonify({'error': 'paymentIntentIdが必要です'}), 400
        
        stripe_secret_key = current_app.config.get('STRIPE_SECRET_KEY', '')
        
        # 本物のStripeキーがある場合は実際のAPIを呼び出す
        if stripe_secret_key and stripe_secret_key.startswith('sk_') and not 'dummy' in stripe_secret_key.lower():
            stripe.api_key = stripe_secret_key
            
            # Stripe APIで決済状態を確認
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            # 決済が成功しているか確認
            if payment_intent.status == 'succeeded':
                return jsonify({
                    'verified': True,
                    'amount': payment_intent.amount,
                    'paymentIntentId': payment_intent.id
                }), 200
            else:
                return jsonify({
                    'verified': False,
                    'status': payment_intent.status
                }), 400
        else:
            # モックモード：モックPaymentIntentの場合は常に成功とする
            if payment_intent_id.startswith('pi_mock_'):
                print(f'⚠️  モック決済検証: payment_intent_id={payment_intent_id}')
                return jsonify({
                    'verified': True,
                    'amount': 0,  # モックなので金額は0
                    'paymentIntentId': payment_intent_id
                }), 200
            else:
                return jsonify({
                    'verified': False,
                    'status': 'unknown'
                }), 400
            
    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f'決済検証エラー: {str(e)}')
        return jsonify({'error': '決済の検証に失敗しました'}), 500


@stripe_payment_bp.route('/config', methods=['GET'])
def get_stripe_config():
    """
    Stripe公開キー取得
    
    説明:
    フロントエンドがStripe.jsを初期化するために必要な
    公開キー(publishable key)を返す
    """
    publishable_key = current_app.config.get('STRIPE_PUBLISHABLE_KEY', '')
    
    # ダミーキーの場合はモック用のキーを返す
    if not publishable_key or 'dummy' in publishable_key.lower():
        publishable_key = 'pk_test_mock_key_for_development'
    
    return jsonify({
        'publishableKey': publishable_key
    }), 200


