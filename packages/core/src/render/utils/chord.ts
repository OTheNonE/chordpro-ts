import type { AstChord } from "$src/ast/structure";

export function renderChord(chord: AstChord): string {
    let result = chord.root;

    if (chord.accidental) {
        result += chord.accidental;
    }

    if (chord.quality) {
        result += chord.quality;
    }

    if (chord.bass) {
        result += "/";
        result += chord.bass.root;

        if (chord.bass.accidental) {
            result += chord.bass.accidental;
        }
    }

    return result;
}