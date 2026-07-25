import type { ChordToken, TextToken, Token } from "$src/lexer/token";
import type { AstLine, AstSegment, AstSong } from "$src/ast/structure"
import { parseChord } from "$src/parser/chord";
import { Stack } from "./stack";
import { parseDirective } from "$src/parser/directive";

export function generateAst(tokens: Array<Token>) {

    const song: AstSong = {
        type: "song",
        metadata: new Array(),
        children: new Array(),
    }

    const stack = new Stack()
    stack.push(song)

    let ignore_emptyline = true

    tokens.forEach(token => {

        if (token.type != "newline") {
            ignore_emptyline = true
        }

        switch (token.type) {
            case "chord":
            case "text": {
                handleTextOrChordCase(token)
                break
            } case "directive": {
                const directive = parseDirective(token.value)
                handleDirectiveCase(directive)
                break
            } case "newline": {

                let top = stack.top()

                if (top.type == "line" || top.type == "segment") {
                    while (top.type == "line" || top.type == "segment") {
                        stack.pop()
                        top = stack.top()
                    }
                } else {
                    if (!ignore_emptyline) {
                        top.children.push({ type: "empty-line" })
                    }
                }

                ignore_emptyline = false

                break
            }
        }
    })

    return song

    function handleTextOrChordCase(token: TextToken | ChordToken) {
        let top = stack.top()

        if (token.type == "chord" && top.type == "segment") {
            stack.pop()
            top = stack.top()
        }

        while (top.type != "segment") {
            if (top.type == "line") {

                const segment: AstSegment = {
                    type: "segment",
                    text: "",
                }

                top.children.push(segment)
                stack.push(segment)

                top = stack.top()

            } else if (top.type == "environment" || top.type == "song") {

                const line: AstLine = {
                    type: "line",
                    children: []
                }

                top.children.push(line)
                stack.push(line)

                top = stack.top()
            }
        }

        if (top.type != "segment") {
            throw new Error("It must be a segment now!")
        }

        if (token.type == "chord") {
            const chord = parseChord(token.value)
            top.chord = chord
        } else if (token.type == "text") {
            top.text = token.value
        }
    }

    function handleDirectiveCase(directive: ReturnType<typeof parseDirective>) {
        switch (directive.type) {
            case "environment": {
                if (directive.action == "start") {

                    let top = stack.top()

                    while (top.type == "environment" || top.type == "line") {
                        stack.pop()
                        top = stack.top()
                    }
                    
                    if (top.type == "song") {
                        top.children.push(directive)
                        stack.push(directive)
                    } else {
                        throw new Error("It cant be anything else than song now!")
                    }
                    
                } else if (directive.action == "end") {

                    let top = stack.top()

                    while (top.type == "line") {
                        stack.pop()
                        top = stack.top()
                    }

                    if (top.type == "song") {
                        // ignore the directive...
                    } else if (top.type == "environment") {
                        if (directive.name != top.name) {
                            console.warn("End directive name does not match the current directive name")
                        }

                        stack.pop()
                    }
                }

                break
            }
            case "comment": {
                const top = stack.top()

                if (top.type == "song" || top.type == "environment") {
                    top.children.push(directive)
                }
                

                directive.name
                break
            }
            case "image": { // TODO
                directive.src
                break
            }
            case "metadata":
                song.metadata.push(directive)
                break
        }
    }


}