export interface DocItem {
  title: string
  slug: string
  description?: string
  children?: DocItem[]
}

export interface DocSection {
  title: string
  slug: string
  items: DocItem[]
}

export const docsNav: Record<string, DocSection[]> = {
  ja: [
    {
      title: '用語と概念',
      slug: 'glossary',
      items: [
        {
          title: 'エラー・欠陥・故障の違いと関係性',
          slug: 'error-defect-failure',
          description: 'ソフトウェアテストにおけるエラー／欠陥／故障の定義と関係',
        },
        {
          title: 'テストの7原則',
          slug: 'testing-principles',
          description: 'あらゆるテストに適用できる7つの一般的なガイドライン',
        },
        {
          title: 'テストプロセスの主要な7つの活動（タスク）',
          slug: '7-main-activities-test-process',
          description: 'JSTQBシラバスに定義されたテストプロセスの主要な7つの活動と具体例',
        },
        {
          title: 'テストレベル',
          slug: 'test-level',
          description: 'コンポーネントテストから受け入れテストまで、5つのテストレベルの定義と属性',
        },
        {
          title: 'ユーザーストーリーとINVEST',
          slug: 'user-story-and-invest',
          description: 'ユーザーストーリーの概念と良いストーリーの基準INVEST',
        },
        {
          title: 'レビュー',
          slug: 'review',
          description: 'レビュープロセス・役割・種別・成功要因と、チェックリストベースドレビューの活用（ISTQB FL 3.2 / JSTQB AL TA 第5章）',
        },
        {
          title: 'テスト技法（JSTQB AL TA v3.1.1）',
          slug: 'test-techniques-v3.1.1',
          description: 'JSTQB AL テストアナリスト シラバスv3.1.1で定義されているテスト技法のまとめ',
          children: [
            {
              title: 'デシジョンテーブルテスト',
              slug: 'decision-table',
              description: 'デシジョンテーブルの構成・制限指定/拡張指定・簡単化・カバレッジ基準（JSTQB AL TA 3.2.3節）',
            },
            {
              title: '状態遷移図',
              slug: 'state-transition-diagram',
              description: '状態遷移テストで用いる状態遷移図の構成要素・書き方・カバレッジ基準',
            },
            {
              title: 'ユースケース図',
              slug: 'use-case-diagram',
              description: 'ユースケーステストで用いるユースケース図の構成要素・書き方・テスト設計への活用',
            },
            {
              title: 'クラシフィケーションツリー技法',
              slug: 'classification-tree',
              description: '入力パラメータと値をツリー構造で整理し、テストケースを網羅的に設計する技法',
            },
          ],
        },
        {
          title: 'プロダクト品質特性(ISO/IEC 25010 2023年版)',
          slug: 'product-quality-characteristics',
          description: 'ISO/IEC 25010（2023年版）が定義するプロダクト品質特性と副特性の一覧',
          children: [
            {
              title: '使用性評価',
              slug: 'usability-testing',
              description: '使用性テスト・ユーザーエクスペリエンス・アクセシビリティの評価手法（JSTQB AL TA 4.2.5節）',
            },
          ],
        },
      ],
    },
    {
      title: '例題・演習',
      slug: 'examples',
      items: [
        {
          title: 'キーワード駆動テスト：キューシステムの受け入れ基準検証',
          slug: 'keyword-driven-testing-queue',
          description: 'キューシステムを題材にしたキーワード駆動テストの例題と解説（JSTQB AL TA）',
        },
        {
          title: 'リスクベーステスト：影響分析とテストケースの優先順位付け',
          slug: 'risk-based-testing-impact-analysis',
          description: 'トレーサビリティマトリクスを用いた影響分析とリスクベース優先順位付けの例題と解説（JSTQB AL TA）',
        },
        {
          title: 'リグレッションテスト戦略：モバイルバンキングアプリの履歴ベース回帰テスト',
          slug: 'regression-testing-strategy-mobile-banking',
          description: '履歴ベースリグレッションテスト戦略の選択と、リスクベース・使用頻度ベースとの違いを解説する例題（JSTQB AL TA）',
        },
        {
          title: 'ドメインテスト：コード複雑度評価システムの境界分析',
          slug: 'domain-testing-cyclomatic-complexity',
          description: '簡略化ドメインカバレッジにおけるON点・OFF点の配置方法を解説する例題（JSTQB AL TA）',
        },
        {
          title: 'ドメインテスト：エスプレッソ制御システムの信頼性ドメインカバレッジ',
          slug: 'domain-testing-espresso-controller',
          description: '測定精度を考慮した信頼性ドメインカバレッジのOFF点計算と欠如テスト点の特定を解説する例題（JSTQB AL TA）',
        },
        {
          title: '組み合わせテスト：ベースチョイスカバレッジ基準の適用',
          slug: 'base-choice-coverage-environment-testing',
          description: 'ベースチョイス法による1パラメータずつの変化と必要なテストケースの導出を解説する例題（JSTQB AL TA）',
        },
        {
          title: 'ペアワイズテスト：住宅保険ポリシーの必要テストケース数',
          slug: 'pairwise-testing-insurance-policy',
          description: '最大パラメータペアの積から100%ペアワイズカバレッジの最小テストケース数を求める例題（JSTQB AL TA）',
        },
        {
          title: '状態遷移テスト：サーキットブレーカーのラウンドトリップカバレッジ',
          slug: 'state-transition-circuit-breaker-round-trip',
          description: '状態遷移図からラウンドトリップを列挙し、テストシーケンスのカバレッジを計算する例題（JSTQB AL TA）',
        },
        {
          title: '状態遷移テスト：保険金請求ライフサイクルの1-スイッチカバレッジ',
          slug: 'state-transition-1switch-insurance-claim',
          description: '各遷移の終点の出次数から1-スイッチ総数を求めるN-スイッチカバレッジの例題（JSTQB AL TA）',
        },
      ],
    },
    {
      title: 'リンク集',
      slug: 'links',
      items: [
        {
          title: 'QA関連サイトのリンク集',
          slug: 'official-sites',
          description: 'QA関連の公式サイト・参考リソース一覧',
        },
        {
          title: 'テストツール',
          slug: 'test-tools',
          description: 'Playwright / Selenium / Appium / Robot Framework など主要テストツールの概要と公式リンク（JSTQB AL TA シラバス分類対応）',
        },
      ],
    },
  ],
  en: [
    {
      title: 'Terms and Concepts',
      slug: 'glossary',
      items: [
        {
          title: 'Product Quality Characteristics (ISO/IEC 25010:2023)',
          slug: 'product-quality-characteristics',
          description: 'List of Product Quality Characteristics and Sub-characteristics Defined by ISO/IEC 25010:2023',
        },
      ],
    },
    {
      title: 'Links',
      slug: 'links',
      items: [
        {
          title: 'Official Sites (JSTQB / ISTQB)',
          slug: 'official-sites',
          description: 'Official sites and reference resources for QA',
        },
      ],
    },
  ],
}
