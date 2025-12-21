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
                'name': 'アザラシの編みぐるみ',
                'price': 3200,
                'description': 'かわいいアザラシの編みぐるみ。つぶらな瞳と丸いフォルムが癒しを与えてくれます。お部屋のインテリアにも最適。',
                'category': '編みぐるみ',
                'stock': 12,
                'image_url': '/images/products/seal.png'
            },
            {
                'name': 'クマの編みぐるみ',
                'price': 2800,
                'description': '手作りのかわいいクマの編みぐるみです。やわらかい毛糸を使用し、ほっこりとした表情が特徴。プレゼントにも最適です。',
                'category': '編みぐるみ',
                'stock': 8,
                'image_url': '/images/products/bear.png'
            },
            {
                'name': 'うさぎの編みぐるみ',
                'price': 2600,
                'description': 'ピンクと白の毛糸で編んだうさぎの編みぐるみ。たれた耳がチャームポイントです。キーホルダーとしても使用できます。',
                'category': '編みぐるみ',
                'stock': 6,
                'image_url': '/images/products/rabbit.png'
            },
            {
                'name': 'エアポッドケース',
                'price': 2200,
                'description': '手編みのかわいいエアポッドケース。大切なイヤホンを優しく守ります。カラビナ付きでバッグに取り付けも可能。',
                'category': '小物',
                'stock': 10,
                'image_url': '/images/products/airpod_case.png'
            },
            {
                'name': 'マフラー',
                'price': 4500,
                'description': 'やわらかい毛糸で編んだシンプルなマフラー。ストライプ模様がおしゃれで、プレゼントにも人気です。',
                'category': 'ファッション',
                'stock': 5,
                'image_url': '/images/products/muffler.png'
            },
            {
                'name': 'トートバッグ',
                'price': 5800,
                'description': '大きめサイズのかぎ針編みトートバッグ。買い物や通勤・通学に便利。カラフルな配色で毎日が楽しくなります。',
                'category': 'バッグ・ポーチ',
                'stock': 4,
                'image_url': '/images/products/bag.png'
            },
            {
                'name': 'コースターセット',
                'price': 1200,
                'description': 'シンプルなグラニースクエアで編んだコースター4枚セット。マットな色合いでテーブルを優しく演出します。',
                'category': '小物',
                'stock': 15,
                'image_url': '/images/products/Coaster.png'
            },
            {
                'name': '小物入れバスケット',
                'price': 3500,
                'description': '実用的な小物入れバスケット。リビングやキッチンで小物整理に最適。自然な色合いでインテリアにもなじみます。',
                'category': '小物',
                'stock': 7,
                'image_url': '/images/products/basket.png'
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


