<script lang="ts">
    import { song } from "$lib";
    import { chordpro, chordproSyntaxHighlighting } from "@chordpro-ts/codemirror";
    import { EditorView } from "@codemirror/view"
    import { basicSetup } from "codemirror"

    let div_element: HTMLDivElement

    $effect(() => {
        const view = new EditorView({
            doc: song,
            parent: div_element,
            extensions: [
                basicSetup,
                chordpro(),
                chordproSyntaxHighlighting
            ]
        })
    })

</script>

<div bind:this={div_element}></div>
