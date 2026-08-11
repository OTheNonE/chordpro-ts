import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { chordproTags } from "./highlighting"

export const chordproHighlightStyle = HighlightStyle.define([
    // Directive symbols ("{", ":", and "}")
    {
        tag: chordproTags.directive,
        color: "rgb(177, 177, 177)",
        fontWeight: "600",
    }, {
        tag: chordproTags.directiveName,
        color: "rgb(0, 104, 208)",
        fontWeight: "600",
    }, {
        tag: chordproTags.directiveValue,
        color: "rgb(239, 108, 42)",
    },

    // Attributes
    {
        tag: chordproTags.attributeName,
        color: "rgb(38, 139, 117)",
    }, {
        tag: chordproTags.attributeEquals,
        color: "rgb(177, 177, 177)",
    }, {
        tag: chordproTags.attributeValue,
        color: "rgb(239, 108, 42)",
    },

    // Chords
    {
        tag: chordproTags.chord,
        color: "#dc2626",
        fontWeight: "700",
    }, {
        tag: chordproTags.chordBracket,
        color: "rgb(177, 177, 177)",
        fontWeight: "700",
    },

    // # comments
    {
        tag: chordproTags.comment,
        color: "#6b7280",
        fontStyle: "italic",
    },
])

export const chordproSyntaxHighlighting = syntaxHighlighting(chordproHighlightStyle)