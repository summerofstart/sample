/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: 'summerofstart/sample', // GitHubのリポジトリ名に置き換えてください
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
