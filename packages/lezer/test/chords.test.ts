import { describe, test } from "bun:test"
import { testTree } from "@lezer/generator/test"
import { parser } from "$src/parser"

describe("chords", () => {
    test("parses a single chord", () => {
        testTree(
            parser.parse("[G]"),
            `Song(
                TextLine(
                    Chord(ChordContent)
                )
            )`
        )
    })

    test("parses an empty chord", () => {
        testTree(
            parser.parse("[]"),
            `Song(
                TextLine(
                    Chord
                )
            )`
        )
    })

    test("parses a slash chord", () => {
        testTree(
            parser.parse("[D/A]"),
            `Song(
                TextLine(
                    Chord(ChordContent)
                )
            )`
        )
    })

    test("parses extended chord names", () => {
        testTree(
            parser.parse("[F#m7]"),
            `Song(
                TextLine(
                    Chord(ChordContent)
                )
            )`
        )
    })

    test("parses chords mixed with lyrics", () => {
        testTree(
            parser.parse("[G]Amazing [G7]grace"),
            `Song(
                TextLine(
                    Chord(ChordContent),
                    Text,
                    Chord(ChordContent),
                    Text
                )
            )`
        )
    })

    test("parses adjacent chords", () => {
        testTree(
            parser.parse("[G][D][Em][C]"),
            `Song(
                TextLine(
                    Chord(ChordContent),
                    Chord(ChordContent),
                    Chord(ChordContent),
                    Chord(ChordContent),
                )
            )`
        )
    })

    test("parses chord between lyric text", () => {
        testTree(
            parser.parse("This is [G]a song"),
            `Song(
                TextLine(
                    Text,
                    Chord(ChordContent),
                    Text,
                )
            )`
        )
    })
})