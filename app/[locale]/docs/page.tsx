import Link from 'next/link'
import { BookOpen, Link2, ChevronRight } from 'lucide-react'
import { docsNav } from '@/lib/docs-config'

const sectionIcons: Record<string, React.ElementType> = {
  '用語と概念': BookOpen,
  'Terms and Concepts': BookOpen,
  'リンク集': Link2,
  'Links': Link2,
}

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
      <p className="text-gray-400 mb-8 not-prose">QAに関する参考資料・ガイドライン</p>

      <div className="not-prose space-y-3">
        {sections.map((section) => {
          const Icon = sectionIcons[section.title] ?? BookOpen
          return (
            <Link
              key={section.slug}
              href={`/${locale}/docs/${section.slug}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 px-5 py-4 transition-all hover:border-accent/40 hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/15 p-2">
                  <Icon size={18} className="text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-white">{section.title}</div>
                  <div className="mt-0.5 text-xs text-gray-400">
                    {section.items.length}件のドキュメント
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="shrink-0 text-gray-500" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
