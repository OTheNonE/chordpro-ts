import type { SyntaxNode } from "@lezer/common"

export function children(
  node: SyntaxNode
): SyntaxNode[] {
  const result: SyntaxNode[] = []

  let child = node.firstChild

  while (child) {
    result.push(child)
    child = child.nextSibling
  }

  return result
}

export function text(node: SyntaxNode, source: string): string {
    return source.slice(node.from, node.to)
}

export function childText(
    node: SyntaxNode,
    name: string,
    source: string,
): string | undefined {
    const found = node.getChild(name)
    return found ? text(found, source) : undefined
}

export function printTree(
    node: SyntaxNode,
    source: string,
    indent = "",
): void {
    const node_name = `${indent}${node.name}`
    const range = `[${node.from}, ${node.to}]`
    const text = `${JSON.stringify(source.slice(node.from, node.to))}`
    
    console.log(
        `${node_name} ${range} ${text}`,
    )

    let child = node.firstChild

    while (child) {
        printTree(child, source, indent + "  ")
        child = child.nextSibling
    }
}