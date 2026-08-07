import { testTree } from "@lezer/generator/test"
import { parser } from "$src/parser"

const tree = parser.parse(`[G]This [D]is [A]a [G]song`)
const spec = `Document(
    TextLine(
        Chord(ChordContent),
        Text,
        Chord(ChordContent),
        Text,
        Chord(ChordContent),
        Text,
        Chord(ChordContent),
        Text
    )
)`

testTree(tree, spec)