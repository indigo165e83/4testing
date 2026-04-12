export interface DocItem {
  title: string
  slug: string
  description?: string
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
          title: 'プロダクト品質特性(ISO/IEC 25010 2023年版)',
          slug: 'product-quality-characteristics',
          description: 'ISO/IEC 25010（2023年版）が定義するプロダクト品質特性と副特性の一覧',
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
