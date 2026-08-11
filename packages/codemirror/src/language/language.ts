// place files you want to import through the `$lib` alias in this folder.
import { LanguageSupport, LRLanguage, syntaxHighlighting } from "@codemirror/language";
import { parser } from "@chordpro-ts/lezer";
import { chordproFolding } from "./folding";
import { chordproHighlighting } from "./highlighting";
import { chordproHighlightStyle } from "./theme";

const chordproLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            chordproFolding,
            chordproHighlighting
        ]
    }),
})

export function chordpro(): LanguageSupport {
    return new LanguageSupport(chordproLanguage, [
        syntaxHighlighting(chordproHighlightStyle, {
            fallback: true
        })
    ])
}