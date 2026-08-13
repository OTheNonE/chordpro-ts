import type { SyntaxNode, Tree } from "@lezer/common";
import type { AstAttribute, AstComment, AstEmptyLine, AstEnvironment, AstLine, AstMetadata, AstSong } from "../ast";
import { children, text } from "./utils";

export function cstToAst(tree: Tree, source: string): AstSong {
    const root = tree.topNode

    if (root.name !== "Song") {
        throw new Error(`Did not get Song node, got instead: "${root.name}"`)
    }

    const song: AstSong = {
        type: "song",
        metadata: new Array(),
        children: new Array()
    }

    const ctx = createAstContext(source)

    children(root)
        .map(child => {
            switch (child.name) {
                case "Environment":
                    return toEnvironment(child, ctx)
                case "Directive":
                    return toDirective(child, ctx)
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

function createAstContext(source: string) {
    return {
        source,
        text: (node: SyntaxNode) => source.slice(node.from, node.to),
        metadata: new Array<AstMetadata>()
    }
}

type AstContext = ReturnType<typeof createAstContext>

function toEnvironment(node: SyntaxNode, ctx: AstContext): AstEnvironment {
    const nodeStart = node.getChild("EnvironmentStart")
    const nodeEnd = node.getChild("EnvironmentEnd")

    const nodeStartName = nodeStart
        ?.getChild("EnvironmentStartName")
        ?.getChild("EnvironmentName")

    const nodeEndName = nodeEnd
        ?.getChild("EnvironmentEndName")
        ?.getChild("EnvironmentName")

    const startName = nodeStartName ? ctx.text(nodeStartName) : ""

    children(node)
        .forEach(child => {

        })


    return {
        type: "environment",
        name: startName,
        attributes

    }
}

function toTextLine(node: SyntaxNode, ctx: AstContext): AstLine {
    return {
        type: "line",
    }
}

function toEmptyLine(): AstEmptyLine {
    return {
        type: "empty-line"
    }
}


function toDirective(node: SyntaxNode, ctx: AstContext): AstComment | null {
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
            ctx.metadata.push({
                type: "metadata",
                name: directiveName,
                value: nodeValue ? text(nodeValue, ctx.source) : ""
            })
            return null
    }

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