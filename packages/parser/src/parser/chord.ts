import type { AstChord } from "../ast/structure";

export function parseChord(str: string): AstChord {
    const regex = /^([A-Za-z0-9])([#b]?)([^/]*)?(?:\/([A-Za-z0-9])([#b]?))?$/
    const match = str.match(regex)

    if (!match) {
        return { type: "chord", root: "" }
    }

    const [, root, accidental, quality, bassRoot, bassAccidental] = match;

    return {
        type: "chord",
        root: root ?? "",
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