import { foldInside, foldNodeProp } from "@codemirror/language";

export const chordproFolding = foldNodeProp.add({
    Environment: foldInside
})