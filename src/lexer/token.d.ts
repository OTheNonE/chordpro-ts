export type Token = 
    | NewLineToken
    | DirectiveToken
    | ChordToken
    | TextToken


export type NewLineToken = {
    type: "newline"
}

export type DirectiveToken = {
    type: "directive"
    value: string
}

export type ChordToken = {
    type: "chord"
    value: string
}

export type TextToken = {
    type: "text"
    value: string
}