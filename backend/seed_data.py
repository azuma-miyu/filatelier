"""初期データ投入スクリプト"""
from app import create_app
from app.models import db, User, Product
from datetime import datetime

def seed_database():
    app = create_app()
    
    with app.app_context():
        # 既存データをクリア
        db.drop_all()
        db.create_all()
        
        print("データベースを初期化しました")
        
        # テストユーザー作成
        user = User(
            email='user@example.com',
            display_name='一般ユーザー',
            is_admin=False
        )
        user.set_password('password123')
        db.session.add(user)
        
        admin = User(
            email='admin@admin.com',
            display_name='管理者',
            is_admin=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        print("ユーザーを作成しました")
        print("  - user@example.com / password123")
        print("  - admin@admin.com / admin123")
        
        # サンプル商品作成（かぎ針編みハンドメイド作品）
        products = [
            {
                'name': 'かぎ針編み クマの編みぐるみ',
                'price': 2800,
                'description': '手作りのかわいいクマの編みぐるみです。やわらかい毛糸を使用し、ほっこりとした表情が特徴。プレゼントにも最適です。',
                'category': '編みぐるみ',
                'stock': 8,
                'image_url': 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=400&fit=crop'
            },
            {
                'name': 'かぎ針編み うさぎの編みぐるみ',
                'price': 2600,
                'description': 'ピンクと白の毛糸で編んだうさぎの編みぐるみ。たれた耳がチャームポイントです。キーホルダーとしても使用できます。',
                'category': '編みぐるみ',
                'stock': 6,
                'image_url': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop'
            },
            {
                'name': 'かぎ針編み コースターセット',
                'price': 1200,
                'description': 'シンプルなグラニースクエアで編んだコースター4枚セット。マットな色合いでテーブルを優しく演出します。',
                'category': '小物',
                'stock': 15,
                'image_url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
            },
            {
                'name': 'かぎ針編み ミニポーチ',
                'price': 3200,
                'description': '手編みのかぎ針編みミニポーチ。口金ファスナー付きで使いやすく、お財布や小物を入れるのに最適。シンプルなデザインでどんなシーンにも合わせられます。',
                'category': 'バッグ・ポーチ',
                'stock': 10,
                'image_url': 'https://images.unsplash.com/photo-1564422170191-4bd349a62c8a?w=400&h=400&fit=crop'
            },
            {
                'name': 'かぎ針編み マフラー',
                'price': 4500,
                'description': 'やわらかい毛糸で編んだシンプルなマフラー。ストライプ模様がおしゃれで、プレゼントにも人気です。',
                'category': 'ファッション',
                'stock': 5,
                'image_url': 'https://images.unsplash.com/photo-1589338569063-86c70e5e24c3?w=400&h=400&fit=crop'
            },
            {
                'name': 'かぎ針編み トートバッグ',
                'price': 5800,
                'description': '大きめサイズのかぎ針編みトートバッグ。買い物や通勤・通学に便利。カラフルな配色で毎日が楽しくなります。',
                'category': 'バッグ・ポーチ',
                'stock': 4,
                'image_url': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop'
            },
            {
                'name': 'かぎ針編み 星型マスコット',
                'price': 800,
                'description': 'かわいい星型のかぎ針編みマスコット。複数色からお選びいただけます。バッグやキーホルダーにつけてアクセントに。',
                'category': 'マスコット',
                'stock': 20,
                'image_url': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop'
            },
            {
                'name': 'かぎ針編み 小物入れバスケット',
                'price': 3500,
                'description': '実用的な小物入れバスケット。リビングやキッチンで小物整理に最適。自然な色合いでインテリアにもなじみます。',
                'category': '小物',
                'stock': 7,
                'image_url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
            }
        ]
        
        for p_data in products:
            product = Product(**p_data)
            db.session.add(product)
        
        db.session.commit()
        print(f"\n{len(products)}件の商品を作成しました")
        print("\n✅ データベースの初期化が完了しました！")

if __name__ == '__main__':
    seed_database()


