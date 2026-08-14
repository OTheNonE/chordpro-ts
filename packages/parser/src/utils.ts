import type { AstSong } from "./ast";

export async function saveTestSong(ast: AstSong) {
    
    const timestamp = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\.\d{3}Z$/, "Z")
    const path = `./out/ast-${timestamp}.json`
    
    await Bun.write(path, JSON.stringify(ast, null, 2));
}