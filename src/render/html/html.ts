import { renderChord } from "$src/render/utils/chord";
import { escapeHtml } from "$src/utils";
import type { Renderer } from "../render";

export const htmlRenderer: Renderer<string> = {
    song(node, children) {
        return `<div class="song">
${children.join("\n")}
</div>`;
    },

    environment(node, children) {
        const label = node.label
            ? `<div class="environment-label">${escapeHtml(node.label)}</div>`
            : "";

        return `<section class="environment environment-${escapeHtml(node.name)}">
${label}
${children.join("\n")}
</section>`;
    },

    line(node, children) {
        return `<div class="line">${children.join("")}</div>`;
    },

    segment(node) {
        const chord = node.chord
            ? `<span class="chord">${escapeHtml(renderChord(node.chord))}</span>`
            : "";

        return `
    <span class="segment">
        ${chord}
        <span class="lyrics">${escapeHtml(node.text)}</span>
    </span>`;
    },

    image(node) {
        const attrs = node.attributes
            .map(a => `${a.name}="${escapeHtml(a.value)}"`)
            .join(" ");

        return `<img src="${escapeHtml(node.src)}"${attrs ? " " + attrs : ""}>`;
    },

    comment(node) {
        return `<!-- ${escapeHtml(node.name)}: ${escapeHtml(node.value)} -->`;
    },

    emptyLine() {
        return `<div class="empty-line"></div>`;
    }
} as const;