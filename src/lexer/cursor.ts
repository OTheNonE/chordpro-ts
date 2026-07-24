export class Cursor {

    private text: string
    private pos: number
    
    constructor(text: string) {
        this.text = text
        this.pos = 0
    }

    advance() {
        this.pos++
    }

    current(): string {
        const character = this.text[this.pos]

        if (!character) {
            throw new Error("Tried to access character out of bounds.")
        }

        return character
    }

    EOF() {
        return this.text.length <= this.pos
    }

}