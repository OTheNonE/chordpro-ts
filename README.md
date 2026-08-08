# ChordPro for Typescript
This is a collection of modern Typescript tools for parsing, rendering and highlighting tools for modern typescript use.

## Open-source libraries used
The following libraries are used (will eventually be used):
- [The Lezer Parser System](https://lezer.codemirror.net/) - For parsing ChordPro documents into CST. Also used for CodeMirror's editor, applying syntax highlighting, code completion, and more.
- [CodeMirror](https://codemirror.net/) - Extensions for the CodeMirror editor.
- [abcjs](https://www.abcjs.net/) - For rendering ABC Music Notation.
- [SVGuitar](https://github.com/omnibrain/svguitar) - For rendering guitar chords.


## Roadmap
Plans are to add the following tools:
- A CST parser generated from Lezer grammar.
- [CodeMirror](https://codemirror.net/) utilites via [Lezer](https://lezer.codemirror.net/)
- Renderers for HTML, DOM, Markdown, ChordPro
