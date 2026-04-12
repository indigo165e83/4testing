import { notFound } from 'next/navigation'
import { docsNav } from '@/lib/docs-config'
import { loadDoc } from '@/lib/docs-loader'

interface PageProps {
  params: Promise<{ locale: string; sectionSlug: string; slug: string }>
}

export async function generateStaticParams() {
  return [
    { locale: 'ja', sectionSlug: 'glossary', slug: 'product-quality-characteristics' },
    { locale: 'en', sectionSlug: 'glossary', slug: 'product-quality-characteristics' },
    { locale: 'ja', sectionSlug: 'glossary', slug: 'error-defect-failure' },
    { locale: 'en', sectionSlug: 'glossary', slug: 'error-defect-failure' },
    { locale: 'ja', sectionSlug: 'glossary', slug: 'testing-principles' },
    { locale: 'en', sectionSlug: 'glossary', slug: 'testing-principles' },
    { locale: 'ja', sectionSlug: 'glossary', slug: '7-main-activities-test-process' },
    { locale: 'en', sectionSlug: 'glossary', slug: '7-main-activities-test-process' },
    { locale: 'ja', sectionSlug: 'links', slug: 'official-sites' },
    { locale: 'en', sectionSlug: 'links', slug: 'official-sites' },
  ]
}

export default async function DocPage({ params }: PageProps) {
  const { locale, sectionSlug, slug } = await params

  // sectionSlug と slug の組み合わせが config に存在するか確認
  const sections = docsNav[locale] ?? docsNav['ja']
  const section = sections.find((s) => s.slug === sectionSlug)
  const docItem = section?.items.find((item) => item.slug === slug)

  if (!docItem) notFound()

  const content = await loadDoc(locale, sectionSlug, slug)
  if (!content) notFound()

  return <>{content}</>
}
