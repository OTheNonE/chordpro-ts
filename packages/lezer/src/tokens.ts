import { ExternalTokenizer } from "@lezer/lr"
import { directiveValueText } from "./parser.terms"

const CHAR = {
  TAB: 9,
  LINE_FEED: 10,
  CHARRIAGE_RETURN: 13,
  SPACE: 32,
  DOUBLE_QUOTE: 34,
  ZERO: 48,
  NINE: 57,
  EQUALS: 61,
  CAPITAL_A: 65,
  CAPITAL_Z: 90,
  BACKSLASH: 92,
  UNDERSCORE: 95,
  A: 97,
  Z: 122,
  LEFT_CURLY_BRACKET: 123,
  RIGHT_CURLY_BRACKET: 125,
} as const;

const isIdentifierStart = (code: number): boolean => {
    return (
        (code >= CHAR.CAPITAL_A && code <= CHAR.CAPITAL_Z) ||   // A-Z
        (code >= CHAR.A && code <= CHAR.Z) ||                   // a-z
        code === CHAR.UNDERSCORE                                // _
    )
}

const isIdentifierCharacter = (code: number): boolean => {
    return isIdentifierStart(code) 
        || (code >= CHAR.ZERO && code <= CHAR.NINE)
}

const isHorizontalSpace = (code: number): boolean => {
    return code === CHAR.SPACE || code === CHAR.TAB // space or tab
}

/**
 * Determines whether `text` is entirely a valid directive-attribute list:
 *
 *     name="value"
 *     name="value" other="value"
 *
 * This deliberately mirrors DirectiveAttributes in the grammar.
 */
function isAttributeList(text: string): boolean {
    let position = 0

    const skipSpace = (): boolean => {
        const start = position

        while (
            position < text.length &&
            isHorizontalSpace(text.charCodeAt(position))
        ) {
            position++
        }

        return position > start
    }

    const parseIdentifier = (): boolean => {
        if (
            position >= text.length ||
            !isIdentifierStart(text.charCodeAt(position))
        ) {
            return false
        }

        position++

        while (
            position < text.length &&
            isIdentifierCharacter(text.charCodeAt(position))
        ) {
            position++
        }

        return true
    }

    const parseString = (): boolean => {
        if (text.charCodeAt(position) !== CHAR.DOUBLE_QUOTE) {
            return false
        }

        position++ // Opening quote

        while (position < text.length) {
            const code = text.charCodeAt(position)

            if (code === CHAR.DOUBLE_QUOTE) {
                position++ // Closing quote
                return true
            }

            if (code === CHAR.BACKSLASH) {
                // Backslash escapes the next character.
                position++

                if (position >= text.length) {
                    return false
                }

                position++
            } else {
                position++
            }
        }

        // No closing quote
        return false
    }

    const parseAttribute = (): boolean => {
        if (!parseIdentifier()) {
            return false
        }

        if (text.charCodeAt(position) !== CHAR.EQUALS) {
            return false
        }

        position++ // "="

        return parseString()
    }
    // BUG: For some reason, the text starts with a space, eventhough
    // the grammar is removing the space before the first attribute.
    // Anyways, it's good to keep this for safe measures.
    skipSpace()

    // The grammar requires at least one attribute.
    if (!parseAttribute()) {
        return false
    }

    while (position < text.length) {
        // Attributes must be separated by at least one space or tab.
        if (!skipSpace()) {
            return false
        }

        if (!parseAttribute()) {
            return false
        }
    }

    return true
}

export const directiveValueTokenizer = new ExternalTokenizer(input => {
    let text = ""
        

    /*
     * Scan until the closing brace, but don't consume the brace itself.
     * Newlines and an unexpected opening brace invalidate this token.
     */
    while (input.next !== -1 && input.next !== CHAR.RIGHT_CURLY_BRACKET) {
        // 125 is "}"
        if (
            input.next === CHAR.LINE_FEED || // "\n"
            input.next === CHAR.CHARRIAGE_RETURN || // "\r"
            input.next === CHAR.LEFT_CURLY_BRACKET   // "{"
        ) {
            return
        }

        text += String.fromCodePoint(input.next)
        input.advance()
    }

    // A closing brace is required, and an empty label isn't accepted.
    if (input.next !== CHAR.RIGHT_CURLY_BRACKET || text.length === 0) {
        return
    }

    /*
     * Let the regular tokenizer handle the input when it is a complete,
     * syntactically valid attribute list.
     */
    if (isAttributeList(text)) {
        return
    }

    input.acceptToken(directiveValueText)
})

type ExternalTokenizerReturner = (name: string, terms: {
    [name: string]: number;
}) => ExternalTokenizer

export const externalTokenizer: ExternalTokenizerReturner = (name) => {
    if (name === "directiveValueTokenizer") {
        return directiveValueTokenizer
    }

    throw new Error(`Unknown external tokenizer: ${name}`)
}