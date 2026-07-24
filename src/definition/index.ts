export const METADATA = new Set([
    "title",
    "subtitle",
    "artist",
    "album",
    "composer",
    "lyricist",
    "key",
    "capo",
    "tempo",
    "time",
    "year",
]);

export const COMMENTS = new Map([
    ["comment", "normal"],
    ["c", "normal"],

    ["comment_italic", "italic"],
    ["ci", "italic"],

    ["comment_box", "box"],
    ["cb", "box"],
]);

export const ENVIRONMENT = new Map<
    string, 
    [
        "chorus" | "verse" | "bridge" | "tab" | "grid", 
        "start" | "end"
    ]
>([
    ["soc",               ["chorus", "start"]],
    ["start_of_chorus",   ["chorus", "start"]],

    ["eoc",               ["chorus", "end"]],
    ["end_of_chorus",     ["chorus", "end"]],

    ["sov",               ["verse", "start"]],
    ["start_of_verse",    ["verse", "start"]],

    ["eov",               ["verse", "end"]],
    ["end_of_verse",      ["verse", "end"]],

    ["sob",               ["bridge", "start"]],
    ["start_of_bridge",   ["bridge", "start"]],

    ["eob",               ["bridge", "end"]],
    ["end_of_bridge",     ["bridge", "end"]],
]);