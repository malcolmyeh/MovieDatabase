export function removeBracket(str) {
  // removes content inside brackets including brackets
  return str.replace(/ *\([^)]*\) */g, "");
}

export function formatLink(url) {
  return removeBracket(url).replace(/\s+/g, "-").toLowerCase();
}

export function unformatLink(url) {
  let words = url.split("-");
  let wordsArr = [];
  words.forEach((element) => {
    wordsArr.push(element[0].toUpperCase() + element.slice(1, element.length));
  });
  return wordsArr.join(" ");
}
