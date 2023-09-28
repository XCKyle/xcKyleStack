import type { ModularBlock } from '@xc/ui/Contentstack'
import React from 'react'
import render from '@xc/ui/RenderOption'

export default function HeroSection({ data }: ModularBlock<Contentstack.Globals.HeroSection>) {
  if (!data) return null
  return (
    <div className="mx-auto my-12 max-w-4xl">
      {data.hero_text.children.map((element: any, i) => (
        <React.Fragment key={i}>{render(element)}</React.Fragment>
      ))}
    </div>
  )
}
