import generateMap from './generateMap'

const blockElements = generateMap(["address", "article", "aside", "blockquote", 
  "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", 
  "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "nav", "noscript", "ol", "p", 
  "pre", "section", "table", "tfoot", "ul", "video"]);

const inlineElements = generateMap(["a", "abbr", "acronym", "b", "bdo", "big", "br", 
  "button", "cite", "code", "dfn", "em", "i", "img", "input", "kbd", "label", "map", "object", 
  "output", "q", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", 
  "time", "tt", "var"]);

const selfClosingElements = generateMap(["area", "base", "br", "col", "command", 
  "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", 
  "source", "track", "wbr"])

export {blockElements, inlineElements, selfClosingElements}