import type { CSSProperties, MouseEvent, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  as?: 'div' | 'li'
  style?: CSSProperties
}

export function Spotlight({ children, className = '', as = 'div', style }: Props) {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement | HTMLLIElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const Tag = as
  return (
    <Tag className={`spotlight ${className}`} style={style} onMouseMove={handleMouseMove}>
      {children}
    </Tag>
  )
}
