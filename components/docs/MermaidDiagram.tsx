'use client'

import { useEffect, useRef, useId } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, '')

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#165e83',
        primaryTextColor: '#ededed',
        primaryBorderColor: '#2d9ba8',
        lineColor: '#2d9ba8',
        background: '#020617',
        mainBkg: '#0f172a',
        nodeBorder: '#165e83',
        clusterBkg: '#0f172a',
        titleColor: '#ededed',
        edgeLabelBackground: '#0f172a',
      },
    })

    mermaid.render(`mermaid-${id}`, chart).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg
    })
  }, [chart, id])

  return <div ref={ref} className="my-6 flex justify-center overflow-x-auto" />
}
