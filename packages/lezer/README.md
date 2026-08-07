# ChordPro - Lezer & CodeMirror

This is the ChordPro Lezer and CodeMirror package. This includes the Lezer grammar for the ChordPro format, and generated modules from this.

## Grammar Syntax and Structure

ChordPro generally supports several directive syntaxes, for example regarding metadata:
```
{name: value} // (standard)
{name value} // (without semicolon)
{meta: name value} // (an alternative way)
```

The following rules are set:
- Use full directive names for metadata (title, not t).
- Use colon syntax ({title: ...}).
- Use dedicated directives for standard metadata (title, artist, key, etc.).
- Use {meta: ...} only for custom or repeated metadata.
- Use named attributes (label="Verse 1") whenever a directive supports them.
- Treat whitespace-only argument syntax ({title My Song}) and positional attribute shorthands as legacy compatibility features rather than preferred style.