# 4Testing — Engineers' Toolbox

テスト業務を加速させる、データ生成・テスト設計補助ツール集。

🌐 **https://4testing.indigo165e83.com**

[![Playwright Tests](https://github.com/indigo165e83/4testing/actions/workflows/playwright.yml/badge.svg)](https://github.com/indigo165e83/4testing/actions/workflows/playwright.yml)

---

## 機能

### データ生成ツール
| ツール | 説明 |
|--------|------|
| Timestamp 変換 | Unix Timestamp と日時（JST/UTC）を相互変換 |
| ダミーユーザー作成 | 氏名・住所・電話番号などのプロフィールをランダム生成 |
| UUID/CUID 生成 | テストデータ用の UUID(v4) / CUID を一括生成 |

### テスト管理・設計
| ツール | 説明 |
|--------|------|
| オールペア生成 | ペアワイズ法（ISTQB AL TA v3.1.1 準拠）で最小テストケースを自動生成 |
| カテゴリ一覧 | 登録済みテスト因子と水準を参照（閲覧のみ） |

### ドキュメント
JSTQB シラバスに基づくテスト用語・概念の解説記事集。

---

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 |
| 認証 | Auth.js v5 (Google OAuth) |
| データベース | PostgreSQL (Neon) / Prisma |
| 国際化 | next-intl（日本語 / English） |
| E2Eテスト | Playwright |
| CI/CD | GitHub Actions |
| デプロイ | Vercel |

---

## ローカル開発

### 必要な環境
- Node.js 20+
- pnpm 9+

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/indigo165e83/4testing.git
cd 4testing

# パッケージをインストール
pnpm install

# 環境変数を設定
cp .env.example .env
# .env を編集して必要な値を入力

# 開発サーバーを起動
pnpm dev
```

http://localhost:3000 をブラウザで開く。

### 環境変数

| 変数名 | 説明 |
|--------|------|
| `DATABASE_URL` | PostgreSQL 接続文字列 |
| `AUTH_SECRET` | Auth.js の署名シークレット |
| `AUTH_GOOGLE_ID` | Google OAuth クライアントID |
| `AUTH_GOOGLE_SECRET` | Google OAuth クライアントシークレット |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` | Google AdSense ID |

---

## テスト

### ローカル（dev環境）

```bash
# dev サーバーを起動しつつテスト実行
pnpm test:dev
```

### 本番環境

```bash
# .env.production の BASE_URL が対象になる
pnpm test:prod
```

### CI（GitHub Actions）

`main` ブランチへの push / PR 作成時に自動実行。  
結果は Actions タブの **Playwright Tests** ワークフローで確認できる。

---

## ディレクトリ構成

```
├── app/[locale]/          # ページ（App Router）
│   ├── page.tsx           # ホームページ
│   ├── docs/              # ドキュメントページ
│   └── tools/             # 各ツールページ
├── components/            # 共通コンポーネント
├── content/docs/          # MDX ドキュメント記事
├── lib/                   # ユーティリティ（アルゴリズム等）
├── messages/              # i18n 翻訳ファイル（ja / en）
├── prisma/                # DB スキーマ
└── tests/                 # Playwright テスト
```
