import type { SyntaxNode, Tree } from "@lezer/common";
import type { AstAttribute, AstChord, AstComment, AstEmptyLine, AstEnvironment, AstLine, AstMetadata, AstSegment, AstSong } from "../ast";
import { children, text } from "./utils";
import { parseChord } from "./chord";

export function cstToAst(tree: Tree, source: string): AstSong {
    const root = tree.topNode

    const ctx = createAstContext(source)

    return toSong(root, ctx)
}

function createAstContext(source: string) {
    return {
        source,
        text: (node: SyntaxNode) => source.slice(node.from, node.to),
    }
}

type AstContext = ReturnType<typeof createAstContext>

function toSong(node: SyntaxNode, ctx: AstContext): AstSong {
    if (node.name !== "Song") {
        throw new Error(`Node was not Song, was ${node.name}`)
    }

    const song: AstSong = {
        type: "song",
        children: new Array()
    }

    children(node).forEach(child => {
        switch (child.name) {
            case "Environment":
                song.children.push(toEnvironment(child, ctx))
                break
            case "Directive":
                const directive = toDirective(child, ctx)
                if (directive) {
                    song.children.push(directive)
                }
                break
            case "TextLine":
                return toTextLine(child, ctx)
            case "EmptyLine":
                return toEmptyLine()
            default:
                throw new Error(`Name was not found: ${child.name}`)
        }
    })

    return song



}

function toEnvironment(node: SyntaxNode, ctx: AstContext): AstEnvironment {
    if (node.name !== "Environment") {
        throw new Error(`Node was not Environment, was ${node.name}`)
    }

    const nodeStart = node.getChild("EnvironmentStart")
    const nodeEnd = node.getChild("EnvironmentEnd")

    const nodeStartName = nodeStart
        ?.getChild("EnvironmentStartName")
        ?.getChild("EnvironmentName")
        ?? null

    // TODO: Needs validation:
    // - Validation to be done within this function,
    // - or validation to be done in a seperate function?
    const nodeEndName = nodeEnd
        ?.getChild("EnvironmentEndName")
        ?.getChild("EnvironmentName")
        ?? null

    const startName = nodeStartName ? ctx.text(nodeStartName) : ""

    const nodeDirectiveValue = nodeStart
        ?.getChild("DirectiveValue")
        ?? null

    const nodeAttributes = nodeStart
        ?.getChild("Attribute")
        ?? null

    const directiveValueOrAttributes = (() => {

        if (nodeAttributes && nodeDirectiveValue) {
            console.warn("Impossible situation: Both attributes and directive value exists in environment.")
        }

        if (nodeAttributes) {
            return { attributes: toAttributes(nodeAttributes, ctx) }
        } else if (nodeDirectiveValue) {
            return { value: ctx.text(nodeDirectiveValue) }
        } else return undefined
    })()

    const environment: AstEnvironment = {
        type: "environment",
        name: startName,
        ...directiveValueOrAttributes,
        children: []
    }

    children(node).forEach(child => {
        switch (child.name) {
            case "Directive":
                environment.children.push(toDirective(child, ctx))
                break
            case "TextLine":
                environment.children.push(toTextLine(child, ctx))
                break
            case "EmptyLine":
                environment.children.push(toEmptyLine())
                break
            case "EnvironmentStart":
            case "EnvironmentEnd":
                // Ignore...
                break
            default:
                throw new Error(`Name was not found: ${child.name}`)
        }
    })


    return environment
}

function toTextLine(node: SyntaxNode, ctx: AstContext): AstLine {

    const line: AstLine = {
        type: "line",
        children: []
    }

    let chord: AstChord | undefined;

    children(node).forEach(child => {
        switch (child.name) {
            case "Text":
                line.children.push({
                    type: "segment",
                    text: toText(child, ctx),
                    chord,
                })
                chord = undefined
                break
            case "Chord":

                if (chord) {
                    line.children.push({
                        type: "segment",
                        text: "",
                        chord
                    })
                }

                chord = toChord(child, ctx)
                break
            default:
                throw new Error(`Name was not found: ${child.name}`)
        }
    })

    if (chord) {
        line.children.push({
            type: "segment",
            text: "",
            chord
        })
    }

    return line
}

function toEmptyLine(): AstEmptyLine {
    return {
        type: "empty-line"
    }
}


function toDirective(node: SyntaxNode, ctx: AstContext): AstComment | AstMetadata {
    if (node.name !== "Directive") {
        throw new Error(`Node was not Directive, was ${node.name}`)
    }

    const nodeName = node.getChild("DirectiveName")
    const nodeValue = node.getChild("DirectiveValue")
    const nodeAttributes = node.getChild("Attributes")

    const directiveName = nodeName ? text(nodeName, ctx.source) : ""
    const directiveValue = nodeValue ? text(nodeValue, ctx.source) : ""

    switch (directiveName) {
        case "comment":
        case "c":
            return {
                type: "comment",
                name: "regular",
                value: directiveValue
            }
        case "comment_italic":
        case "ci":
            return {
                type: "comment",
                name: "italic",
                value: directiveValue
            }
        case "comment_box":
        case "cb":
            return {
                type: "comment",
                name: "box",
                value: directiveValue
            }
        default:
            return {
                type: "metadata",
                name: directiveName,
                value: nodeValue ? text(nodeValue, ctx.source) : ""
            }
    }

}

function toChord(node: SyntaxNode, ctx: AstContext): AstChord {
    if (node.name !== "Chord") {
        throw new Error(`Node was not Chord, was ${node.name}`)
    }

    const nodeChordContent = node.getChild("ChordContent")

    const chordContent = nodeChordContent ? ctx.text(nodeChordContent) : ""

    const chord = parseChord(chordContent)

    return chord
}

function toText(node: SyntaxNode, ctx: AstContext): string {
    if (node.name !== "Text") {
        throw new Error(`Node was not Text, was ${node.name}`)
    }

    return ctx.text(node)
}

function toAttributes(node: SyntaxNode, ctx: AstContext): Array<AstAttribute> {
    if (node.name !== "Attributes") {
        throw new Error(`Node was not Attributes, was ${node.name}`)
    }

    return children(node)
        .map(child => toAttribute(child, ctx))
}

function toAttribute(node: SyntaxNode, ctx: AstContext): AstAttribute {
    if (node.name !== "Attribute") {
        throw new Error(`Node was not Attribute, was ${node.name}`)
    }

    const nodeName = node.getChild("AttributeName")
    const nodeValue = node.getChild("AttributeValue")

    return {
        type: "attribute",
        name: nodeName ? text(nodeName, ctx.source) : "",
        value: nodeValue ? text(nodeValue, ctx.source) : ""
    }

}