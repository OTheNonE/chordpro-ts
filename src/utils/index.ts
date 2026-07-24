import type { AstSong } from "$src/ast/structure"
import type { Token } from "$src/lexer/token"

export function normalizeTextFileContent(text: string) {
    return text
        // Replace windows newline for unix newline
        .replace(/\r\n/g, "\n")
        // Replace macos newline for unix newline
        .replace(/\r/g, "\n")
}

export function escapeHtml(str: string): string {
    return str
}

export function generateTokenLabels(tokens: Array<Token>) {
    return tokens.map(token => {
        switch (token.type) {
            case "chord": return `Chord(${token.value})`
            case "directive": return `Directive(${token.value})`
            case "newline": return `Newline()`
            case "text": return `Text(${token.value})`
        }
    })
}

export async function saveTestSong(ast: AstSong) {
    
    const timestamp = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\.\d{3}Z$/, "Z")
    const path = `./build/ast-${timestamp}.json`
    
    await Bun.write(path, JSON.stringify(ast, null, 2));
}

export function serveSimpleHtml(html: string, css_filepath: string) {
    const wrapped_html = `
<!DOCTYPE html>
<html>
    <head>
        <title>ChordPro</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        ${html}
    </body>
</html>
    `

    Bun.serve({
        port: 3000,
        fetch(req) {
            const url = new URL(req.url)

            if (url.pathname === "/") {
                return new Response(wrapped_html, {
                    headers: {
                        "Content-Type": "text/html; charset=utf-8"
                    }
                })
            }

            if (url.pathname === "/style.css") {
                return new Response(Bun.file(css_filepath))
            }

            return new Response("Not Found", { status: 404 })
        }
    })

    console.log("Server running at http://localhost:3000")

}