export interface DocItem {
  title: string
  slug: string
  description?: string
}

export interface DocSection {
  title: string
  items: DocItem[]
}

export const docsNav: Record<string, DocSection[]> = {
  ja: [
    {
      title: '用語と概念',
      items: [
        {
          title: 'プロダクト品質特性(ISO/IEC 25010 2023年版)',
          slug: 'product-quality-characteristics',
          description: 'ISO/IEC 25010（2023年版）が定義するプロダクト品質特性と副特性の一覧',
        },
      ],
    },
  ],
  en: [
    {
      title: 'QA Fundamentals',
      items: [
        {
          title: 'ISO/IEC 25010 Quality Characteristics',
          slug: 'product-quality-characteristics',
          description: 'Product quality characteristics and sub-characteristics defined by ISO/IEC 25010 (2023)',
        },
      ],
    },
  ],
}
