export function removeBracket(str) {
    // removes content inside brackets including brackets
    return str.replace(/ *\([^)]*\) */g, "");
}

export function formatLink(url) {
    return removeBracket(url).replace(/\s+/g, '-').toLowerCase();
}