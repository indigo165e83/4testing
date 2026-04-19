'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { docsNav } from '@/lib/docs-config'

interface DocsSidebarProps {
  locale: string
}

export function DocsSidebar({ locale }: DocsSidebarProps) {
  const pathname = usePathname()
  const sections = docsNav[locale] ?? docsNav['ja']

  return (
    <nav className="w-56 shrink-0">
      {sections.map((section) => {
        const sectionHref = `/${locale}/docs/${section.slug}`
        const isSectionActive = pathname === sectionHref

        return (
          <div key={section.slug} className="mb-6">
            {/* セクションタイトル（クリックでセクションTOPへ） */}
            <Link
              href={sectionHref}
              className={`mb-1 block px-2 py-1 text-md font-bold transition-colors ${
                isSectionActive
                  ? 'text-accent-light'
                  : 'text-accent-light/80 hover:text-accent-light'
              }`}
            >
              {section.title}
            </Link>

            {/* 記事一覧 */}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const href = `/${locale}/docs/${section.slug}/${item.slug}`
                const isActive = pathname === href
                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-accent/20 font-medium text-accent'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.title}
                    </Link>

                    {/* 子項目 */}
                    {item.children && item.children.length > 0 && (
                      <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                        {item.children.map((child) => {
                          const childHref = `/${locale}/docs/${section.slug}/${child.slug}`
                          const isChildActive = pathname === childHref
                          return (
                            <li key={child.slug}>
                              <Link
                                href={childHref}
                                className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                                  isChildActive
                                    ? 'bg-accent/20 font-medium text-accent'
                                    : 'text-gray-500 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {child.title}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
