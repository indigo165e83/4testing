import { notFound } from 'next/navigation'
import { docsNav } from '@/lib/docs-config'
import { loadDoc } from '@/lib/docs-loader'

interface PageProps {
  params: Promise<{ locale: string; sectionSlug: string; slug: string }>
}

export async function generateStaticParams() {
  const params: { locale: string; sectionSlug: string; slug: string }[] = []
  const locales = Object.keys(docsNav)

  for (const locale of locales) {
    for (const section of docsNav[locale]) {
      for (const item of section.items) {
        params.push({ locale, sectionSlug: section.slug, slug: item.slug })
        for (const child of item.children ?? []) {
          params.push({ locale, sectionSlug: section.slug, slug: child.slug })
        }
      }
    }
  }

  return params
}

export default async function DocPage({ params }: PageProps) {
  const { locale, sectionSlug, slug } = await params

  // sectionSlug と slug の組み合わせが config に存在するか確認
  const sections = docsNav[locale] ?? docsNav['ja']
  const section = sections.find((s) => s.slug === sectionSlug)
  const docItem = section?.items.find(
    (item) => item.slug === slug || item.children?.some((c) => c.slug === slug)
  )

  if (!docItem) notFound()

  const content = await loadDoc(locale, sectionSlug, slug)
  if (!content) notFound()

  return <>{content}</>
}
