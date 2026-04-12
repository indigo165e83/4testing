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
      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const href = `/${locale}/docs/${item.slug}`
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
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
