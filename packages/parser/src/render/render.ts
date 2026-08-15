import type { 
    AstComment, AstEmptyLine, 
    AstEnvironment, AstLine, 
    AstNode, AstSong, AstSegment 
} from "../ast/structure";

export interface Renderer<T, C> {
    song(node: AstSong, children: Array<T>, ctx?: C): T
    environment(node: AstEnvironment, children: Array<T>, ctx?: C): T
    line(node: AstLine, children: Array<T>, ctx?: C): T
    segment(node: AstSegment, ctx?: C): T
    comment(node: AstComment, ctx?: C): T
    emptyLine(node: AstEmptyLine, ctx?: C): T
}

export function render<T, C>(node: AstNode, renderer: Renderer<T, C>): T {
    switch (node.type) {
        case "song":
            return renderer.song(
                node,
                node.children.map(child => render(child, renderer))
            )

        case "environment":
            return renderer.environment(
                node,
                node.children.map(child => render(child, renderer))
            );

        case "line":
            return renderer.line(
                node,
                node.children.map(child => render(child, renderer))
            );

        case "segment":
            return renderer.segment(node);

        case "comment":
            return renderer.comment(node);

        case "empty-line":
            return renderer.emptyLine(node);

        default:
            throw new Error("Unknown node!")
    }
}