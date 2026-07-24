import type { 
    AstComment, AstEmptyLine, 
    AstEnvironment, AstImage, AstLine, 
    AstNode, AstSong, AstSegment 
} from "$src/ast/structure";

export interface Renderer<T> {
    song(node: AstSong, children: Array<T>): T
    environment(node: AstEnvironment, children: Array<T>): T
    line(node: AstLine, children: Array<T>): T
    segment(node: AstSegment): T
    image(node: AstImage): T
    comment(node: AstComment): T
    emptyLine(node: AstEmptyLine): T
}

export function render<T>(node: AstNode, renderer: Renderer<T>): T {
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

        case "image":
            return renderer.image(node);

        case "comment":
            return renderer.comment(node);

        case "empty-line":
            return renderer.emptyLine(node);

        default:
            throw new Error("Unknown node!")
    }
}