import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { docsNav } from '@/lib/docs-config'

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const sections = docsNav[locale] ?? docsNav['ja']

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Documents</h1>
      <p className="text-gray-400 mb-8 not-prose">QAに関する用語と概念のまとめページです。</p>

      {sections.map((section) => (
        <div key={section.title} className="mb-8 not-prose">
          <h2 className="mb-4 text-base font-semibold text-accent">{section.title}</h2>
          <div className="grid gap-3">
            {section.items.map((item) => (
              <Link
                key={item.slug}
                href={`/${locale}/docs/${item.slug}`}
                className="flex items-start gap-3 rounded-lg border border-white/10 p-4 transition-all hover:border-accent/40 hover:bg-white/5"
              >
                <BookOpen size={18} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <div className="font-medium text-white">{item.title}</div>
                  {item.description && (
                    <div className="mt-0.5 text-sm text-gray-400">{item.description}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
