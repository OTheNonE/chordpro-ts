// place files you want to import through the `$lib` alias in this folder.
import { HighlightStyle, LanguageSupport, LRLanguage, syntaxHighlighting } from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { parser } from "@chordpro-ts/lezer";

const configuredParser = parser.configure({
    props: [
        styleTags({
            "EnvironmentStartKeyword/...": tags.keyword,
            EnvironmentStart: tags.keyword,
            "EnvironmentEndKeyword/...": tags.keyword,
            EnvironmentEnd: tags.keyword,

            "Metadata!": tags.keyword,

            // Chords
            Chord: tags.labelName,
            ChordContent: tags.labelName,

            // Lyrics
            Text: tags.content,

            
            "{ }": tags.brace,
            "[ ]": tags.labelName,
        })
    ]
})

const chordproLanguage = LRLanguage.define({
    parser: configuredParser,
})

export const chordproHighlightStyle = HighlightStyle.define([
    // {title: ...}, {artist: ...}, {start_of_chorus}, etc.
    {
        tag: tags.keyword,
        color: "#7c3aed",
        fontWeight: "600",
    },

    // title, artist, capo, key, comment, start_of_chorus...
    {
        tag: tags.attributeName,
        color: "#2563eb",
        fontWeight: "600",
    },

    // Values inside directives
    {
        tag: tags.attributeValue,
        color: "#0f766e",
    },

    // [C], [Am7], [F#], [G/B]
    {
        tag: tags.labelName,
        color: "#dc2626",
        fontWeight: "700",
    },

    // # comments
    {
        tag: tags.comment,
        color: "#6b7280",
        fontStyle: "italic",
    },

    // Normal lyrics
    {
        tag: tags.content,
        color: "#374151",
    },

    // Braces/brackets
    {
        tag: [tags.brace, tags.squareBracket],
        color: "#9ca3af",
    },
])

export const chordproSyntaxHighlighting = syntaxHighlighting(chordproHighlightStyle)

export function chordproLanguageSupport(): LanguageSupport {
    return new LanguageSupport(chordproLanguage)
}

export const song = `{title:Góðska Guds }
{subtitle:Goodness of God }
{key: A}

{comment: Intro: Kassagittar, so klaver+bass í vers}

{sov Verse 1.}
1. Eg elski [A]teg, tí tín [D/A]náði ei meg [A]svíkur.
Hvønn ein [F#m]dag hond tín [D]sterka meg [Esus4]ber. [E]
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