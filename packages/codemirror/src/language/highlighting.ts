import { styleTags, tags, Tag } from "@lezer/highlight";

export const chordproTags = {
    "directive": Tag.define(tags.brace),
    "directiveName": Tag.define(tags.processingInstruction),
    "directiveValue": Tag.define(tags.string),

    "attributeName": Tag.define(tags.attributeName),
    "attributeEquals": Tag.define(tags.operator),
    "attributeValue": Tag.define(tags.attributeValue),

    "chord": Tag.define(tags.string),
    "chordBracket": Tag.define(tags.squareBracket),

    "comment": Tag.define(tags.comment)

} as const

export const chordproHighlighting = styleTags({

    // Directives (regular)
    Directive: chordproTags.directive,
    "DirectiveName": chordproTags.directiveName,
    "DirectiveValue": chordproTags.directiveValue,

    // Attributes
    AttributeName: chordproTags.attributeName,
    "AttributeEqual": chordproTags.attributeEquals,
    "AttributeValue!": chordproTags.attributeValue,

    // Environment
    EnvironmentStart: chordproTags.directive,
    EnvironmentEnd: chordproTags.directive,
    "EnvironmentStartName!": chordproTags.directiveName,
    "EnvironmentEndName!": chordproTags.directiveName,

    // Chords
    Chord: chordproTags.chordBracket,
    ChordContent: chordproTags.chord,

    // Comments
    Comment: chordproTags.comment
})