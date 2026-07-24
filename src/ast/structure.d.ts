/**
 * Number of Directive types:
 * - Metadata
 * - Formatting (split into comment and image)
 * - Environment
 * - (Not used) Delegated
 * - (Not used) Chord diagrams
 * - (Not used) Transposition
 * - (Not used) Fonts, size and colours
 * - (Not used) Output related
 */

export type AstNode = 
    | AstSong
    | AstMetadata
    | AstEnvironment
    | AstLine
    | AstEmptyLine
    | AstComment
    | AstImage
    | AstSegment
    | AstChord

export type AstSong = {
    type: "song"
    metadata: Array<AstMetadata>
} & WithChildren<
    | AstEnvironment
    | AstLine
    | AstEmptyLine
    | AstComment
    | AstImage
>

export type AstMetadata = {
    type: "metadata"
    name: string
    value: string
}

export type AstEnvironment = {
    type: "environment"
    name: string
    label?: string
} & WithChildren<
    | AstLine
    | AstEmptyLine
    | AstComment
    | AstImage
>

export type AstLine = {
    type: "line"
} & WithChildren<AstSegment>

export type AstSegment = {
    type: "segment"
    chord?: AstChord
    text: string
}

export type AstChord = {
    type: "chord"
    root: string;
    accidental?: "#" | "b";
    quality?: string;
    bass?: {
        root: string
        accidental?: "#" | "b"
    };
}

export type AstEmptyLine = {
    type: "empty-line"
}

export type AstComment = {
    type: "comment"
    name: string
    value: string
}

export type AstImage = {
    type: "image"
    src: string
    attributes: Array<{
        name: string
        value: string
    }>
}

export type WithChildren<T> = {
    children: Array<T>
}