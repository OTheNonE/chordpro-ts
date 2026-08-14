import { describe, test } from "bun:test"
import { testTree } from "@lezer/generator/test"

import { parser } from "../src/parser.js"

describe("directives", () => {
    test("parses directives without a value", () => {
        testTree(
            parser.parse("{new_song}"),
            `Song(
                Directive(
                    DirectiveName
                )
            )`
        )
    })

    test("parses directives with colon-separated value", () => {
        testTree(
            parser.parse("{title: Amazing Grace}\n"),
            `Song(
                Directive(
                    DirectiveName,
                    DirectiveValue
                )
            )`
        )
    })

    test("allows whitespace around the colon", () => {
        testTree(
            parser.parse("{title  :  Amazing Grace}\n"),
            `Song(
                Directive(
                    DirectiveName,
                    DirectiveValue
                )
            )`
        )
    })

    test("parses directive with whitespace separator", () => {
        testTree(
            parser.parse("{title Amazing Grace}\n"),
            `Song(
                Directive(
                    DirectiveName,
                    DirectiveValue
                )
            )`
        )
    })

    test("parses numeric-looking directive value as text", () => {
        testTree(
            parser.parse("{capo: 2}\n"),
            `Song(
                Directive(
                    DirectiveName,
                    DirectiveValue
                )
            )`
        )
    })

    test("parses value containing punctuation", () => {
        testTree(
            parser.parse("{artist: Intro: guitar, piano + bass}\n"),
            `Song(
                Directive(
                    DirectiveName,
                    DirectiveValue
                )
            )`,
        )
    })

    test("parses a single attribute", () => {
        testTree(
            parser.parse('{comment label="Intro"}\n'),
            `Song(
                Directive(
                    DirectiveName,
                    Attributes(
                        Attribute(
                            AttributeName,
                            AttributeValue(
                                StringContent
                            )
                        )
                    )
                )
            )`,
        )
    })

    test("parses multiple attributes", () => {
        testTree(
            parser.parse('{section label="Verse 1" style="chorus"}\n'),
            `Song(
                Directive(
                    DirectiveName,
                    Attributes(
                        Attribute(
                            AttributeName,
                            AttributeValue(
                                StringContent
                            )
                        ),
                        Attribute(
                            AttributeName,
                            AttributeValue(
                                StringContent
                            )
                        )
                    )
                )
            )`,
        )
    })

    

    test("parses multiple attributes with whitespace around directive colon-separator", () => {
        testTree(
            parser.parse('{comment : label="Intro"}\n'),
            `Song(
                Directive(
                    DirectiveName,
                    Attributes(
                        Attribute(
                            AttributeName,
                            AttributeValue(
                                StringContent
                            )
                        )
                    )
                )
            )`,
        )
    })
})