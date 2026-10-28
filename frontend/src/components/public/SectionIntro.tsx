import { ReactNode } from 'react'

/** Page heading block for public inner pages: saffron rule, eyebrow, title and optional lead text. */
export function SectionIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="public-section-intro"><span className="section-rule" /><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children}</div>
}
