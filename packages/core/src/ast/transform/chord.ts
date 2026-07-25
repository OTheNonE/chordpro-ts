import type { AstChord } from "../structure";

const chromaticNotes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];

function noteToMidiIndex(root: string, accidental?: "#" | "b"): number {
    const note = root.toUpperCase() + (accidental ?? "");

    const flatMap: Record<string, string> = {
        "Db": "C#",
        "Eb": "D#",
        "Gb": "F#",
        "Ab": "G#",
        "Bb": "A#",
    };

    const normalized = flatMap[note] ?? note;
    const index = chromaticNotes.indexOf(normalized);

    if (index === -1) {
        throw new Error(`Invalid note: ${note}`);
    }

    return index;
}

function indexToNote(index: number): Pick<AstChord, "root" | "accidental"> {
    const note = chromaticNotes[((index % 12) + 12) % 12];
    
    if (!note) {
        throw new Error(`Invalid note index: ${index}`);
    }

    const [ root, accidental ] = note
    
    if (!root) {
        throw new Error(`Invalid root: ${root}`);
    }

    if (note.length === 1) {
        return { root: note };
    }

    if (!(accidental === "#" || accidental === "b")) {
        throw new Error(`Invalid accidental: ${accidental}`);
    }
    
    return { root, accidental };
}

function transposeNote<T extends Pick<AstChord, "root" | "accidental">>(note: T, halfnotes: number): T {

    const index = noteToMidiIndex(note.root, note.accidental);
    const transposed = indexToNote(index + halfnotes);

    // Mutate the original object
    note.root = transposed.root;
    note.accidental = transposed.accidental;

    return note
}

export function transposeChord(chord: AstChord, halfnotes: number): AstChord {

    transposeNote(chord, halfnotes)
    if (chord.bass) {
        transposeNote(chord.bass, halfnotes)
    }

    return chord;
}