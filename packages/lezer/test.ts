import type { Tree } from "@lezer/common";
import { buildParser } from "@lezer/generator"

const grammarSpec = await Bun
    .file("./src/chordpro.grammar", { type: "utf8" })
    .text()
const parser = buildParser(grammarSpec)

const chordproSample = `
{title: Amazing Grace}
{artist: John Newton}

{soc Chorus}
[G]Amazing [G7]grace! How [C]sweet the [G]sound
{eoc}

{c: Repeat twice}
`;

const tree = parser.parse(chordproSample);

function printNodes(tree: Tree, sourceCode: string) {
  const cursor = tree.cursor();

  do {
    // Slice the original string using the cursor's character offsets
    const nodeText = sourceCode.slice(cursor.from, cursor.to).trim();

    // Skip empty whitespace nodes or huge top-level wrappers for cleaner output
    if (nodeText) {
      console.log(`${"  ".repeat(cursor.depth)}${cursor.name}: "${nodeText}"`);
    }
  } while (cursor.next());
}

printNodes(tree, chordproSample);

// console.log("=== PARSE TREE ===");
// console.log(tree);