import { normalizeTextFileContent } from "../utils";
import { Cursor } from "./cursor";
import type { ChordToken, DirectiveToken, NewLineToken, TextToken, Token } from "./token";

export function tokenize(text: string) {

    const normalized_text = normalizeTextFileContent(text)

    const cursor = new Cursor(normalized_text)
    const tokens = new Array<Token>()

    while (!cursor.EOF()) {

        const current = cursor.current()

        switch (current) {
            case "{":
                tokens.push(getDirectiveToken(cursor))
                break
            case "[":
                tokens.push(getChordToken(cursor))
                break
            case "\n":
                tokens.push(getNewlineToken(cursor))
                break
            default:
                tokens.push(getTextToken(cursor))
                break
        }
    }

    return tokens
}

function getDirectiveToken(cursor: Cursor) {
    cursor.advance(); // Skip the opening {

    let content = "";

    while (!cursor.EOF() && cursor.current() !== "}") {
        content += cursor.current();
        cursor.advance();
    }

    if (cursor.EOF()) {
        throw new Error("Unterminated directive");
    }

    cursor.advance(); // Skip the closing }
    
    const token: DirectiveToken = {
        type: "directive",
        value: content
    }

    return token
}

function getChordToken(cursor: Cursor) {
    cursor.advance(); // Skip the opening [

    let content = "";

    while (!cursor.EOF() && cursor.current() !== "]") {
        content += cursor.current();
        cursor.advance();
    }

    if (cursor.EOF()) {
        throw new Error("Unterminated directive");
    }

    cursor.advance(); // Skip the closing ]
    
    const token: ChordToken = {
        type: "chord",
        value: content
    }

    return token
}

function getNewlineToken(cursor: Cursor) {

    const token: NewLineToken = {
        type: "newline"
    }

    cursor.advance()

    return token
}

function getTextToken(cursor: Cursor) {

    let content = "";

    while (
        !cursor.EOF() 
        && !["[", "{", "\n"].includes(cursor.current())
    ) {
        content += cursor.current();
        cursor.advance();
    }
    
    const token: TextToken = {
        type: "text",
        value: content
    }

    return token
}