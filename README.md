# ChordPro for Typescript

This is a collection of ChordPro parsing, rendering and highlighting tools for modern typescript use.

## Simple usage

Currently, you can use the library like so:

```ts
import { generateAst } from "$src/ast"
import { tokenize } from "$src/lexer"
import { htmlRenderer, render } from "$src/render"

const tokens = tokenize(text)
const ast = generateAst(tokens)
const html = render(ast, htmlRenderer)
```

## Roadmap
Plans are to add the following tools:
- [CodeMirror](https://codemirror.net/) utilites via [Lezer](https://lezer.codemirror.net/)
- Renderers for HTML, DOM, Markdown, ChordPro
