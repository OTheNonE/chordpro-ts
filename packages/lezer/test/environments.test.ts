import { describe, test } from "bun:test"
import { testTree } from "@lezer/generator/test"
import { parser } from "$src/parser"

console.log(parser.parse("{start_of_verse}\n{end_of_verse}\n").toString())

describe("environments", () => {
    test("parses an empty environment", () => {
        testTree(
            parser.parse("{start_of_verse}\n{end_of_verse}\n"),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        )
                    ),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })

    test("parses environment containing text", () => {
        testTree(
            parser.parse(
                `{start_of_verse}
This is a verse
{end_of_verse}
`,
            ),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        )
                    ),
                    TextLine(Text),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })

    test("parses environment containing chords", () => {
        testTree(
            parser.parse(
                `{start_of_verse}
[G]Amazing [C]grace
{end_of_verse}
`,
            ),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        )
                    ),
                    TextLine(
                        Chord(ChordContent),
                        Text,
                        Chord(ChordContent),
                        Text
                    ),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })

    test("parses multiple lines in an environment", () => {
        testTree(
            parser.parse(
                `{start_of_chorus}
[G]Line one
[C]Line two
{end_of_chorus}
`,
            ),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        )
                    ),
                    TextLine(
                        Chord(ChordContent),
                        Text
                    ),
                    TextLine(
                        Chord(ChordContent),
                        Text
                    ),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })
    
    test("parses blank lines inside an environment", () => {
        testTree(
            parser.parse(
                `{start_of_verse}
First line

Second line
{end_of_verse}
`,
            ),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        )
                    ),
                    TextLine(Text),
                    EmptyLine,
                    TextLine(Text),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })

    test("parses short environment syntax", () => {
        testTree(
            parser.parse(
                `{sov}
[G]Verse
{eov}
`,
            ),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        )
                    ),
                    TextLine(
                        Chord(ChordContent),
                        Text
                    ),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })

    test("parses short environment syntax with directive value and whitespace-separator", () => {
        testTree(
            parser.parse(
                `{sov Verse 1}
[G]Verse
{eov}
`,
            ),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        ),
                        DirectiveValue
                    ),
                    TextLine(
                        Chord(ChordContent),
                        Text
                    ),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })

    test("parses environment with an attribute", () => {
        testTree(
            parser.parse(
                `{start_of_verse label="Verse 1"}
[G]First verse
{end_of_verse}
`,
            ),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        )
                        Attributes(
                            Attribute(
                                AttributeName,
                                AttributeValue(
                                    StringContent
                                )
                            )
                        )
                    ),
                    TextLine(
                        Chord(ChordContent),
                        Text
                    ),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })

    test("parses short environment with colon before attributes", () => {
        testTree(
            parser.parse(
            `{sov: label="Verse 2"}
Second verse
{eov}
`,
            ),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        ),
                        Attributes(
                            Attribute(
                                AttributeName,
                                AttributeValue(
                                    StringContent
                                )
                            )
                        )
                    ),
                    TextLine(Text),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })

    test("parses short environment with whitespace around colon before attributes", () => {
        testTree(
            parser.parse(
            `{sov  :  label="Verse 2"}
Second verse
{eov}
`,
            ),
            `Song(
                Environment(
                    EnvironmentStart(
                        EnvironmentStartName(
                            EnvironmentName
                        ),
                        Attributes(
                            Attribute(
                                AttributeName,
                                AttributeValue(
                                    StringContent
                                )
                            )
                        )
                    ),
                    TextLine(Text),
                    EnvironmentEnd(
                        EnvironmentEndName(
                            EnvironmentName
                        )
                    )
                )
            )`,
        )
    })

})