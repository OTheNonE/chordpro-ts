import { cstToAst } from "./src/parser/parser"
import { printTree } from "./src/parser/utils"
import { parser } from "@chordpro-ts/lezer"
import { saveTestSong } from "./src/utils"

export const song = `{title: Góðska Guðs}
{subtitle: Goodness of God }
{key: A}

{comment: Intro: Kassagittar, so klaver+bass í vers}

{sov label="Verse 1."}
1. Eg elski [A]teg, tí tín [D/A]náði ei meg [A]svíkur.
Hvønn ein [F#m]dag hond tín [D]sterka meg [Esus4]ber. [E][D][H]
Tá eg opni míni [F#m]eygu, [D] og til eg [A]leggi me-[F#m]g,
vil eg [D]syngja um [E]góðsku Tína, [A]Gud.
{eov}

Chorus - øll koma inn her!

{soc}
[D]Alt mítt lív Tú ert so [A]trúgvur.
[D]Alt mítt lív Tú góður [A]ert við [E]meg.
[D]Hvønn andadrátt á hvørjum [A]degi[F#m]
vil eg [D]syngja um [E]góðsku Tína, [A]Gud
{eoc}

{sov: label="Verse 2."}
2. Tín rødd so mild leiddi meg ígjøgnum trongdir
Og í myrku nátt vart Tú nær sum eingin annar
Eg kenni Teg sum pápa, eg kenni Teg sum vin,
og lív mítt gyrt er av góðsku Tíni, Gud.
{eov}

chorus
Alt mítt lív tú ert so trúgvur.....

{sob}
[A/C#]Tín góðska [D]fylgir mær. Hon [E]floymir yvir [A]meg x2
Alt mítt [A/C#]lív er Títt, eg Tær [D]gevi alt.
Eg [E]yvirgevi [F#m]meg.
Tín [A/C#]góðska [D]fylgir mær, hon [E]floymir yvir [A]meg.
{eob}`

const cst = parser.parse(song)

const ast = cstToAst(cst, song)

saveTestSong(ast)

// printTree(cst.topNode, song, "")