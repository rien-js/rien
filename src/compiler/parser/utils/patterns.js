const whiteSpace = /\s/;
const closingTag = /^<\s*\/\s*([-a-zA-Z0-9_]+)\s*>/;
const openingTag = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
// const attribute = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g
const attribute = /(\w+)\s*=\s*((["'])(.*?)\3)/g
export {whiteSpace, openingTag, closingTag, attribute};