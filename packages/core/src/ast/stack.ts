import type { AstEnvironment, AstLine, AstSegment, AstSong } from "./structure";

export type StackChildren = 
    | AstSong
    | AstEnvironment
    | AstLine
    | AstSegment

export class Stack {

    private stack: Array<StackChildren>

    constructor() {
        this.stack = new Array()
    }

    push(item: StackChildren) {
        this.stack.push(item)
    }

    pop() {
        this.stack.pop()
    }

    top() {
        const item = this.stack.at(-1)

        if (!item) {
            throw new Error("Stack is empty")
        }

        return item
    }
    
}