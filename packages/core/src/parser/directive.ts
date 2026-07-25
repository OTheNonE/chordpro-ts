import type { AstComment, AstImage, AstMetadata, AstEnvironment } from "$src/ast/structure";
import { COMMENTS, METADATA, ENVIRONMENT } from "$src/definition";

export interface RawDirective {
    name: string;
    value?: string;
}

export type EnvironmentDirective = AstEnvironment & {
    action: "start" | "end"
}

export function parseDirective(str: string): 
    AstMetadata | AstComment | AstImage | EnvironmentDirective {
    const raw_directive = parseRawDirective(str)

    if (METADATA.has(raw_directive.name)) {
        return parseMetadataDirective(raw_directive)
    } else if (COMMENTS.has(raw_directive.name)) {
        return parseCommentDirective(raw_directive)
    } else if (ENVIRONMENT.has(raw_directive.name)) {
        return parseEnvironmentDirective(raw_directive)
    } else if (raw_directive.name == "image") {
        return parseImageDirective(raw_directive)
    } else {
        return parseMetadataDirective(raw_directive)
    }
}

export function parseRawDirective(str: string): RawDirective {
    const colon = str.indexOf(":");
    const space = str.indexOf(" ");

    let separator = -1;

    if (colon === -1) {
        separator = space;
    } else if (space === -1) {
        separator = colon;
    } else {
        separator = Math.min(colon, space);
    }

    if (separator === -1) {
        return {
            name: str.trim().toLowerCase(),
        };
    }

    if (colon > space) {
        separator = colon
    }

    return {
        name: str.slice(0, separator).trim().toLowerCase(),
        value: str.slice(separator + 1).trim()
    }
}

export function parseMetadataDirective(directive: RawDirective): AstMetadata {
    
    const { name, value } = directive

    if (!value) {
        throw new Error(`Metadata Directive did not have a value: ${JSON.stringify(directive)}`)
    }

    return { type: "metadata", name, value }
}

export function parseCommentDirective(directive: RawDirective): AstComment {
    
    const { value } = directive

    const name = COMMENTS.get(directive.name)

    if (!name) {
        throw new Error(`Comment type was not found in the list of comment types: ${JSON.stringify(directive)}`)
    }

    if (!value) {
        throw new Error(`Comment Directive did not have a value: ${JSON.stringify(directive)}`)
    }
    
    return { type: "comment", name, value }
}

export function parseEnvironmentDirective(directive: RawDirective): EnvironmentDirective {

    const environment = ENVIRONMENT.get(directive.name)

    if (!environment) {
        throw new Error(`Environment was not found: ${directive.name}`)
    }

    const [ name, action ] = environment

    let label = undefined;

    if (directive.value) {
        const match = directive.value.match(/^label\s*=\s*"([^"]*)"$/);

        if (match) {
            label = match[1];
        } else {
            // Treat the whole value as the label
            label = directive.value;
        }
    }

    return { type: "environment", name, action, label, children: [] }
}

export function parseImageDirective(directive: RawDirective): AstImage {

    // TODO!
    const src = ""

    return { type: "image", src, attributes: [] }
}