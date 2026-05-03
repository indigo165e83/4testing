import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ExternalLink } from 'lucide-react'
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

  if (section.externalHref) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-2">{section.title}</h1>
        <p className="text-gray-400 mb-8 not-prose">
          下記のサイトを参照してください。
        </p>
        <div className="not-prose">
          <a
            href={section.externalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 transition-all hover:border-accent/40 hover:bg-white/5"
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{section.title}</div>
              <div className="mt-0.5 text-xs text-gray-400">{section.externalHref}</div>
            </div>
            <ExternalLink size={16} className="shrink-0 text-gray-500" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{section.title}</h1>
      <p className="text-gray-400 mb-8 not-prose">
        {section.items.reduce((acc, item) => acc + 1 + (item.children?.length ?? 0), 0)}件のドキュメント
      </p>

      <div className="not-prose space-y-2">
        {section.items.map((item) => (
          <div key={item.slug}>
            <Link
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

            {item.children && item.children.length > 0 && (
              <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                {item.children.map((child) => (
                  <Link
                    key={child.slug}
                    href={`/${locale}/docs/${sectionSlug}/${child.slug}`}
                    className="flex items-start justify-between gap-4 rounded-lg border border-white/5 px-4 py-2.5 transition-all hover:border-accent/40 hover:bg-white/5"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-300">{child.title}</div>
                      {child.description && (
                        <div className="mt-0.5 text-xs text-gray-500">{child.description}</div>
                      )}
                    </div>
                    <ChevronRight size={14} className="mt-0.5 shrink-0 text-gray-600" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
