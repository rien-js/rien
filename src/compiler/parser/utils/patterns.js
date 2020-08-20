const whiteSpace = /\s/;
const closingTag = /^<\s*\/\s*([-a-zA-Z0-9_]+)\s*>/;
// const openingTag = /^<\s*([-A-Za-z0-9_]+)((?:\s+[-A-Za-z0-9_]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
const openingTag = /^<\s*([-A-Za-z0-9_]+)\s*((?:[-A-Za-z0-9_]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?\s*)*)\s*(\/?)>/
// const attribute = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g
const attribute = /([_a-zA-Z0-9-]+)\s*=\s*((["'`])(.*?)\3|({)(.*?)})/g
const scriptEnd = /<\s*\/\s*script\s*>/
export {whiteSpace, openingTag, closingTag, attribute, scriptEnd};