import type { AstEnvironment, AstMetadata, AstNode, AstSong } from "../ast";
import type { Renderer } from "./render";


export function render(ast: AstSong): HTMLElement {

    const ctx = createContext()

    const html = renderSong(ast, ctx)

    return html
}

function createContext() {
    return {
        metadata: new Array<AstMetadata>()
    }
}

type RenderContext = ReturnType<typeof createContext>

function renderSong(song: AstSong, ctx: RenderContext): HTMLElement {

    const root = document.createElement("article")
    root.className = "chordpro-song"

    for (const child of song.children) {
        switch (child.type) {
            case "environment":
                root.appendChild(
                    renderEnvironment(child, ctx)
                )
                break;
        
            default:
                break;
        }
    }

    return root
}

function renderEnvironment(environment: AstEnvironment, ctx: RenderContext): HTMLElement {
    const section = document.createElement("section")

    return section
}