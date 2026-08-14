import type { AstSong } from "../ast";

export function renderSong(song: AstSong): HTMLElement {

    const root = document.createElement("article")

    root.className = "chordpro-song"

    for (const child of song.children) {

    }

    return root
}