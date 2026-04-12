import fs from 'fs/promises'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import type { ReactElement } from 'react'

export async function loadDoc(
  locale: string,
  sectionSlug: string,
  slug: string
): Promise<ReactElement | null> {
  // ロケール固有ファイルを優先し、なければ日本語にフォールバック
  const candidates = [
    path.join(process.cwd(), 'content', 'docs', locale, sectionSlug, `${slug}.mdx`),
    path.join(process.cwd(), 'content', 'docs', 'ja', sectionSlug, `${slug}.mdx`),
  ]

  let source: string | null = null
  for (const filePath of candidates) {
    try {
      source = await fs.readFile(filePath, 'utf-8')
      break
    } catch {
      // 次の候補へ
    }
  }

  if (!source) return null

  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  })

  return content
}
