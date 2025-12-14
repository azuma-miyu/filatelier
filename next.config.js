/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Docker用にstandalone出力を有効化
}

module.exports = nextConfig

