# 🚀 次にやること

Stripe決済の実装が完了しました！次の手順で動作確認とデプロイを行ってください。

---

## 📋 **実装完了後の手順**

### **1. Stripeアカウント作成（5分）**

まだStripeアカウントがない場合：

1. https://stripe.com/jp にアクセス
2. 「今すぐ始める」をクリック
3. メールアドレスとパスワードで登録
4. **完全無料**（テストモードは永久無料）

---

### **2. APIキーを取得（2分）**

1. Stripeダッシュボードにログイン
2. 左メニュー「開発者」→「APIキー」
3. **テストモード**を選択
4. 以下をコピー：
   - 公開可能キー: `pk_test_...`
   - シークレットキー: `sk_test_...`

---

### **3. ローカルで動作確認**

#### **3-1. 環境変数を設定**

プロジェクトルートに `.env.local` ファイルを作成：

\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_ここにあなたの公開キー
STRIPE_SECRET_KEY=sk_test_ここにあなたのシークレットキー
\`\`\`

#### **3-2. パッケージをインストール**

\`\`\`bash
# フロントエンド
npm install

# バックエンド
cd backend
pip install -r requirements.txt
cd ..
\`\`\`

#### **3-3. サーバーを起動**

**ターミナル1（バックエンド）**：
\`\`\`bash
cd backend
python wsgi.py
\`\`\`

**ターミナル2（フロントエンド）**：
\`\`\`bash
npm run dev
\`\`\`

#### **3-4. 決済テスト**

1. http://localhost:3000 にアクセス
2. 商品をカートに追加
3. 「注文手続きへ」をクリック
4. テストカード情報を入力：
   - カード番号: `4242 4242 4242 4242`
   - 有効期限: `12/34`
   - CVC: `123`
5. 「支払う」をクリック
6. ✅ 決済成功！

---

### **4. 本番環境（Oracle ARM）へデプロイ**

#### **4-1. Gitにプッシュ**

⚠️ **重要**: 環境変数ファイル（`.env.local`）はpushしない！

\`\`\`bash
git add .
git commit -m "Stripe決済機能を実装"
git push origin main
\`\`\`

#### **4-2. サーバーで更新を取得**

\`\`\`bash
ssh ubuntu@あなたのサーバーIP

cd /home/ubuntu/filatelier
git pull origin main
\`\`\`

#### **4-3. 環境変数を設定**

\`\`\`bash
nano .env.production
\`\`\`

以下を追加（既存の内容に追記）：

\`\`\`bash
# Stripe設定（テストモード）
STRIPE_SECRET_KEY=sk_test_あなたのシークレットキー
STRIPE_PUBLISHABLE_KEY=pk_test_あなたの公開キー
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_あなたの公開キー
\`\`\`

保存: `Ctrl+X` → `Y` → `Enter`

#### **4-4. Dockerを再ビルド**

\`\`\`bash
docker compose down
docker compose build --no-cache
docker compose up -d
\`\`\`

#### **4-5. ログ確認**

\`\`\`bash
# 全体のログ
docker compose logs -f

# バックエンドのみ
docker compose logs -f backend

# フロントエンドのみ
docker compose logs -f frontend
\`\`\`

エラーがなければ成功！

#### **4-6. 本番環境でテスト**

1. https://filatelier.azumiyu.com にアクセス
2. 商品をカートに追加
3. 決済テスト（テストカード: `4242 4242 4242 4242`）
4. ✅ 決済成功を確認！

---

## 🔍 **動作確認ポイント**

### **✅ チェックリスト**

- [ ] 決済ページでカード入力フォームが表示される
- [ ] テストカードで決済成功
- [ ] 決済後、注文がDBに保存される
- [ ] 商品の在庫が減る
- [ ] カートがクリアされる
- [ ] 成功ページにリダイレクトされる

### **🔍 確認方法**

#### **1. DBに注文が保存されたか確認**

\`\`\`bash
docker exec -it ec-db psql -U postgres -d ecshop

# 注文一覧
SELECT id, user_id, total, status, stripe_payment_intent_id, created_at FROM orders;

# 注文明細
SELECT * FROM order_items;

# 終了
\\q
\`\`\`

#### **2. Stripeダッシュボードで確認**

1. Stripeダッシュボードにログイン
2. 「支払い」タブをクリック
3. テスト決済が記録されていることを確認

---

## 💡 **トラブルシューティング**

### **問題1: 「Stripe設定が見つかりません」**

**解決策**:
\`\`\`bash
# 環境変数が設定されているか確認
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# 開発サーバーを再起動
npm run dev
\`\`\`

### **問題2: 「決済の準備に失敗しました」**

**解決策**:
\`\`\`bash
# バックエンドのログ確認
docker compose logs backend

# 環境変数を確認
docker exec -it ec-backend env | grep STRIPE
\`\`\`

### **問題3: カード入力フォームが表示されない**

**解決策**:
\`\`\`bash
# ブラウザのコンソールを確認（F12キー）
# npmパッケージが正しくインストールされているか確認
npm list @stripe/react-stripe-js
\`\`\`

---

## 🎓 **参考資料**

- 詳細なセットアップ: `STRIPE_SETUP.md`
- Stripe公式ドキュメント: https://stripe.com/docs
- テストカード番号: https://stripe.com/docs/testing

---

## 🚀 **本番運用に向けて（将来）**

現在はテストモードです。実際に販売を開始する場合：

### **1. Stripeアカウントを本人確認**

1. Stripeダッシュボード
2. 「アカウント」→「アカウント設定」
3. 本人確認書類を提出
4. 銀行口座を登録

### **2. 本番モードに切り替え**

1. Stripeダッシュボードで「本番モード」に切り替え
2. 本番用APIキーを取得（`pk_live_...` と `sk_live_...`）
3. `.env.production` を更新
4. Dockerを再ビルド

### **3. 本番運用開始**

- お客様が実際のカードで決済可能に
- 売上がStripeダッシュボードに記録される
- 週1回、銀行口座に振り込まれる
- 手数料: 3.6%のみ（固定費なし）

---

## ✅ **完了！**

以上でStripe決済の実装・デプロイが完了です！

質問があれば、いつでも聞いてください 🎉


