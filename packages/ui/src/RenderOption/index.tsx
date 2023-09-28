import { Next, NodeType, Node, MarkType } from '@contentstack/utils'
import { JSX } from 'react'
import { RenderItem, RenderMark, RenderNode } from '@contentstack/utils/dist/types/options'
import { isObject } from 'lodash'

type RenderJSX = (node: Node, next: Next) => JSX.Element

interface RenderOption {
  [embedType: string]: RenderNode | RenderMark | RenderItem | RenderJSX
}

const renderOption: RenderOption = {
  [NodeType.DOCUMENT]: (_: Node) => {
    return ``
  },
  [NodeType.PARAGRAPH]: (node: Node, next: Next) => {
    return `<p>${next(node.children)}</p>`
  },
  [NodeType.LINK]: (node: Node, next: Next) => {
    if (node.attrs.target) {
      return `<a href="${node.attrs.href || node.attrs.url}" target="${node.attrs.target}">${next(node.children)}</a>`
    }
    return `<a href="${node.attrs.href || node.attrs.url}">${next(node.children)}</a>`
  },
  [NodeType.IMAGE]: (node: Node, next: Next) => {
    return `<img src="${node.attrs.src || node.attrs.url}" />${next(node.children)}`
  },
  [NodeType.EMBED]: (node: Node, next: Next) => {
    return `<iframe src="${node.attrs.src || node.attrs.url}">${next(node.children)}</iframe>`
  },
  [NodeType.HEADING_1]: (node: Node, next: Next) => {
    return `<h1>${next(node.children)}</h1>`
  },
  [NodeType.HEADING_2]: (node: Node, next: Next) => {
    return (
      <h2 style={{ ...node.attrs['style'] }} className="mb-5 text-[28px] font-semibold leading-tight md:text-[34px]">
        {next(node.children)}
      </h2>
    )
  },
  [NodeType.HEADING_3]: (node: Node, next: Next) => {
    return `<h3>${next(node.children)}</h3>`
  },
  [NodeType.HEADING_4]: (node: Node, next: Next) => {
    return `<h4>${next(node.children)}</h4>`
  },
  [NodeType.HEADING_5]: (node: Node, next: Next) => {
    return (
      <h5 style={{ ...node.attrs['style'] }} className="text-md md:text-xl">
        {next(node.children)}
      </h5>
    )
  },
  [NodeType.HEADING_6]: (node: Node, next: Next) => {
    return `<h6>${next(node.children)}</h6>`
  },
  [NodeType.ORDER_LIST]: (node: Node, next: Next) => {
    return `<ol>${next(node.children)}</ol>`
  },
  [NodeType.UNORDER_LIST]: (node: Node, next: Next) => {
    return `<ul>${next(node.children)}</ul>`
  },
  [NodeType.LIST_ITEM]: (node: Node, next: Next) => {
    return `<li>${next(node.children)}</li>`
  },
  [NodeType.TEXT]: (text: string) => {
    console.log('###################', text)
    return text
  },
  [NodeType.HR]: (node: Node, next: Next) => {
    return `<hr>`
  },
  [NodeType.TABLE]: (node: Node, next: Next) => {
    return `<table>${next(node.children)}</table>`
  },
  [NodeType.TABLE_HEADER]: (node: Node, next: Next) => {
    return `<thead>${next(node.children)}</thead>`
  },
  [NodeType.TABLE_BODY]: (node: Node, next: Next) => {
    return `<tbody>${next(node.children)}</tbody>`
  },
  [NodeType.TABLE_FOOTER]: (node: Node, next: Next) => {
    return `<tfoot>${next(node.children)}</tfoot>`
  },
  [NodeType.TABLE_ROW]: (node: Node, next: Next) => {
    return `<tr>${next(node.children)}</tr>`
  },
  [NodeType.TABLE_HEAD]: (node: Node, next: Next) => {
    return `<th>${next(node.children)}</th>`
  },
  [NodeType.TABLE_DATA]: (node: Node, next: Next) => {
    return `<td>${next(node.children)}</td>`
  },
  [NodeType.BLOCK_QUOTE]: (node: Node, next: Next) => {
    return `<blockquote>${next(node.children)}</blockquote>`
  },
  [NodeType.CODE]: (node: Node, next: Next) => {
    return `<code>${next(node.children)}</code>`
  },

  ['reference']: (node: Node, next: Next) => {
    if (node.attrs['type'] === 'asset') {
      return `<img src="${node.attrs['asset-link']}" />`
    }
    return ``
  },
  ['default']: (node: Node, next: Next) => {
    return next(node.children)
  },

  [MarkType.BOLD]: (text: string) => {
    return `<strong>${text}</strong>`
  },
  [MarkType.ITALIC]: (text: string) => {
    return `<em>${text}</em>`
  },
  [MarkType.UNDERLINE]: (text: string) => {
    return `<u>${text}</u>`
  },
  [MarkType.STRIKE_THROUGH]: (text: string) => {
    return `<strike>${text}</strike>`
  },
  [MarkType.INLINE_CODE]: (text: string) => {
    return `<span>${text}</span>`
  },
  [MarkType.SUBSCRIPT]: (text: string) => {
    return `<sub>${text}</sub>`
  },
  [MarkType.SUPERSCRIPT]: (text: string) => {
    return `<sup>${text}</sup>`
  },
  [MarkType.BREAK]: (text: string) => {
    return `<br />${text}`
  },
}

export default function render(element: any | any[] | Record<string, any>): JSX.Element | any {
  if (element.length > 0) {
    return element.map((el: any) => render(el))
  } else if (element.type) {
    const option = renderOption[element.type]
    // @ts-ignore
    return option(element, render)
  } else if (isObject(element)) {
    return Object.keys(element).map((key) => {
      const option = renderOption[key]
      // @ts-ignore
      return option(element[key])
    })
  }
}
