const whiteSpace = /\s/;
const closingTag = /<\s*\/\s*([a-zA-Z]+)\s*>/;
const openingTag = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
const attribute = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g
export {whiteSpace, openingTag, closingTag, attribute};