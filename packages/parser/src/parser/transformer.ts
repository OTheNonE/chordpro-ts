// import type { SyntaxNode } from "@lezer/common";
// import type { 
//     AstChord, AstComment, AstEmptyLine, AstEnvironment, AstLine, AstMetadata, AstNode, AstSong 
// } from "../ast";
// import { children, text } from "./utils";

// export interface Transformer {
//     song(
//         node: SyntaxNode, 
//         children: AstSong["children"]
//     ): AstSong

//     environment(
//         node: SyntaxNode,
//         children: AstEnvironment["children"]
//     ): AstEnvironment

//     line(
//         node: SyntaxNode,
//         children: AstLine["children"]
//     ): AstLine

//     directive(node: SyntaxNode): AstMetadata | AstComment
//     emptyLine(node: SyntaxNode): AstEmptyLine
// }

// export function transform(
//     node: SyntaxNode,
//     transformer: Transformer
// ): AstNode {
//     switch (node.name) {
//         case "Song":
//             return transformer.song(
//                 node,
//                 transformChildren(
//                     node, 
//                     transformer,
//                     isSongChild
//                 )
//             )
        
//         case "Environment":
//             return transformer.environment(
//                 node,
//                 transformChildren(
//                     node,
//                     transformer,
//                     isEnvironmentChild
//                 )
//             )

//         case "TextLine":
//             return transformer.line(
//                 node,
//                 transformChildren(
//                     node,
//                     transformer,
//                     isLineChild
//                 )
//             )
//         case "Directive":
//             return transformer.directive(node)
//         case "EmptyLine":
//             return transformer.emptyLine(node)

//         default:
//             throw new Error(`Unknown CST node: ${node.name}`)
//     }
// }

// const transformer: Transformer = {
//     directive(node) {
//         const nodeName = node.getChild("DirectiveName")

//         if (!nodeName) {
//             throw new Error("Directive has no name")
//         }

//         const directiveName = text(nodeName)

//         if (directiveName === "comment") {
//             return transformComment(node)
//         }

//         return transformMetadata(node)
//     },
// }

// function transformChildren<T extends AstNode>(
//     node: SyntaxNode,
//     transformer: Transformer,
//     isAllowedAsChild: (node: AstNode) => node is T
// ): Array<T> {
//     return Array.from(children(node))
//         .filter(isAstRelevantNode)
//         .map(child => transform(child, transformer))
//         .filter(isAllowedAsChild)
// }

// function isSongChild(
//     node: AstNode
// ): node is AstSong["children"][number] {
//     switch (node.type) {
//         case "environment":
//         case "line":
//         case "empty-line":
//         case "comment":
//             return true

//         default:
//             return false
//     }
// }

// function isEnvironmentChild(
//     node: AstNode
// ): node is AstEnvironment["children"][number] {
//     switch (node.type) {
//         case "line":
//         case "empty-line":
//         case "comment":
//             return true
//         default:
//             return false
//     }
// }

// function isLineChild(
//     node: AstNode
// ): node is AstLine["children"][number] {
//     switch (node.type) {
//         case "segment":
//             return true
//         default:
//             return false
//     }
// }

// function isAstRelevantNode(node: SyntaxNode): boolean {
//     switch (node.name) {
//         case "Environment":
//         case "TextLine":
//         case "Chord":
//         case "Directive":
//         case "Comment":
//         case "BlankLine":
//             return true
//         default:
//             return false
//     }
// }