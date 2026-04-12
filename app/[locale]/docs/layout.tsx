import Link from 'next/link'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { BookOpen } from 'lucide-react'

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-accent/20 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-accent font-bold text-sm text-white">
              4
            </div>
            <span className="font-semibold">4Testing</span>
          </Link>
          <span className="text-gray-600">/</span>
          <Link
            href={`/${locale}/docs`}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <BookOpen size={14} />
            <span>Documents</span>
          </Link>
        </div>
      </header>

      {/* コンテンツエリア */}
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        {/* サイドバー */}
        <aside className="hidden md:block pt-1">
          <DocsSidebar locale={locale} />
        </aside>

        {/* メインコンテンツ */}
        <main className="min-w-0 flex-1">
          <article className="prose prose-invert prose-slate max-w-none
            prose-headings:scroll-mt-20
            prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-6
            prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
            prose-table:w-full prose-table:text-sm
            prose-th:bg-white/5 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
            prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-white/10
            prose-strong:text-white
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-hr:border-white/10
          ">
            {children}
          </article>
        </main>
      </div>
    </div>
  )
}
