import type { ComponentPropsWithoutRef, ReactElement } from 'react'
import { MermaidDiagram } from './MermaidDiagram'

type CodeElement = ReactElement<{ className?: string; children?: string }>

function CustomPre({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const code = children as CodeElement
  const className = code?.props?.className ?? ''
  const content = String(code?.props?.children ?? '').trim()

  if (className.includes('language-mermaid')) {
    return <MermaidDiagram chart={content} />
  }

  return <pre {...props}>{children}</pre>
}

export const mdxComponents = {
  pre: CustomPre,
}
