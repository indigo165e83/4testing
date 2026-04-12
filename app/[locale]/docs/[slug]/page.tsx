import { notFound } from 'next/navigation'
import { docsNav } from '@/lib/docs-config'
import { loadDoc } from '@/lib/docs-loader'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  return [
    { locale: 'ja', slug: 'product-quality-characteristics' },
    { locale: 'en', slug: 'product-quality-characteristics' },
  ]
}

export default async function DocPage({ params }: PageProps) {
  const { locale, slug } = await params

  // slug が docs-config に存在するか確認
  const sections = docsNav[locale] ?? docsNav['ja']
  const allItems = sections.flatMap((s) => s.items)
  const docItem = allItems.find((item) => item.slug === slug)

  if (!docItem) notFound()

  const content = await loadDoc(locale, slug)
  if (!content) notFound()

  return <>{content}</>

}
