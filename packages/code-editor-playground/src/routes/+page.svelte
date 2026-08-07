<script lang="ts">
    import { chordproLanguageSupport, chordproSyntaxHighlighting, song } from "$lib";
    import { EditorView } from "@codemirror/view"
    import { basicSetup } from "codemirror"

    let div_element: HTMLDivElement

    $effect(() => {
        const view = new EditorView({
            doc: song,
            parent: div_element,
            extensions: [
                basicSetup,
                chordproLanguageSupport(),
                chordproSyntaxHighlighting
            ]
        })
    })

</script>

<div bind:this={div_element}></div>
