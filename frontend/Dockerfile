# ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY .npmrc ./
COPY package*.json ./
RUN npm ci

# アプリケーションコードのコピー
COPY . .

# Next.jsビルド
RUN npm run build

# 本番ステージ
FROM node:20-alpine AS runner

WORKDIR /app

# 本番用の環境変数
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 必要なファイルのみコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 非rootユーザーで実行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# ポート公開
EXPOSE 3000

# Next.js起動
CMD ["node", "server.js"]

