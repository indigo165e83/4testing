import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { docsNav } from '@/lib/docs-config'

interface PageProps {
  params: Promise<{ locale: string; sectionSlug: string }>
}

export async function generateStaticParams() {
  return [
    { locale: 'ja', sectionSlug: 'glossary' },
    { locale: 'ja', sectionSlug: 'links' },
    { locale: 'en', sectionSlug: 'glossary' },
    { locale: 'en', sectionSlug: 'links' },
  ]
}

export default async function SectionIndexPage({ params }: PageProps) {
  const { locale, sectionSlug } = await params
  const sections = docsNav[locale] ?? docsNav['ja']
  const section = sections.find((s) => s.slug === sectionSlug)

  if (!section) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{section.title}</h1>
      <p className="text-gray-400 mb-8 not-prose">
        {section.items.length}件のドキュメント
      </p>

      <div className="not-prose space-y-2">
        {section.items.map((item) => (
          <Link
            key={item.slug}
            href={`/${locale}/docs/${sectionSlug}/${item.slug}`}
            className="flex items-start justify-between gap-4 rounded-lg border border-white/10 px-4 py-3 transition-all hover:border-accent/40 hover:bg-white/5"
          >
            <div>
              <div className="text-sm font-medium text-white">{item.title}</div>
              {item.description && (
                <div className="mt-0.5 text-xs text-gray-400">{item.description}</div>
              )}
            </div>
            <ChevronRight size={16} className="mt-0.5 shrink-0 text-gray-500" />
          </Link>
        ))}
      </div>
    </div>
  )
}
