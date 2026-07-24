import type { AstChord } from "$src/ast/structure";


export function parseChord(str: string): AstChord {
    const regex = /^([A-G])([#b]?)([^/]*)?(?:\/([A-G])([#b]?))?$/
    const match = str.match(regex)

    if (!match) {
        throw new Error(`Invalid chord: ${str}`);
    }

    const [, root, accidental, quality, bassRoot, bassAccidental] = match;

    if (!root) {
        throw new Error(`Invalid chord: ${str}`)
    }

    return {
        type: "chord",
        root,
        ...(accidental && { accidental: accidental as "#" | "b" }),
        ...(quality && { quality }),
        ...(bassRoot && {
            bass: {
                root: bassRoot,
                ...(bassAccidental && {
                    accidental: bassAccidental as "#" | "b",
                }),
            },
        }),
    };
}