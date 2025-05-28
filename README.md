# Gengoka Frontend - 言語化の極意

言語化の極意（Gengoka）は、日本のビジネスコミュニケーション能力向上を支援するAI学習アプリです。

## 機能

- 3フェーズ15問題の段階的学習システム
- Google Gemini APIによるAI添削機能
- 学習履歴の記録・分析
- 個人分析レポート生成

## 技術構成

- **フロントエンド**: Next.js 15 + TypeScript + TailwindCSS
- **バックエンド**: FastAPI + Python
- **AI**: Google Gemini API

## ローカル開発

```bash
npm install
npm run dev
```

## Vercelデプロイ設定

### 必要な環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

```
ESLINT_NO_DEV_ERRORS=true
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NODE_ENV=production
```

### ビルド設定

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Framework Preset**: Next.js

### デプロイ手順

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. デプロイを実行

## API連携

バックエンドAPI（FastAPI）が別途必要です。
バックエンドのURLを`NEXT_PUBLIC_API_URL`環境変数に設定してください。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
