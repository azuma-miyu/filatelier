FROM nginx:alpine

# Nginx設定のコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Certbot用ディレクトリ作成
RUN mkdir -p /var/www/certbot

# ポート公開
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

