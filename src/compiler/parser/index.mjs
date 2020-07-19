import { whiteSpace, openingTag, closingTag, attribute } from './utils/patterns.mjs';
const log = console.log;


// const template = `<div class='child'><span>asdf</span></div>`;
// let doc = parse(template, 'text/html');
// console.log(doc);


// not support for attributes yet

const generateMap = (string) => {
  const map = {};
  const items = string.split(',');
  items.forEach((item) => {
    map[item.trim()] = true;
  })
  return map;
}

const blockElements = generateMap("address, article, aside, blockquote, \
  canvas, dd, div, dl, dt, fieldset, figcaption, figure, footer, form, \
  h1, h2, h3, h4, h5, h6, header, hr, li, main, nav, noscript, ol, p, \
  pre, section, table, tfoot, ul, video");

const inlineElements = generateMap("a, abbr, acronym, b, bdo, big, br, \
  button, cite, code, dfn, em, i, img, input, kbd, label, map, object, \
  output, q, samp, script, select, small, span, strong, sub, sup, textarea, \
  time, tt, var>");

export default function parse(template) {
  let index = 0;
  let stack = [];
  let match;
  const wholeLength = template.length;

  // Is parent necessary?
  const createNewElement = (type, attrs, parent, tagName,) => {
    return {
      type,
      tagName,
      attrs,
      parent,
      children: []
    };
  }

  const parseWhiteSpace = () => {
    while (index < template.length &&
      whiteSpace.test(template[index])) {
      index++;
    }
  }

  const parseOpeningTag = (tag, tagName, attributes, rest) => {
    // TODO handle tags like <li>
    // handle tags self closed
    log(tagName);
    log(attributes);
    const attrs = [];
    if (attributes) {
      let lexicalMatch;
      while (lexicalMatch = attributes.exec(attribute)) {
        attrs[lexicalMatch[1]] = lexicalMatch[2];
      }
    }
    const newElement = createNewElement(1, attrs, curNode, tagName);
    curNode.children.push(newElement);
    curNode = newElement;
    stack.push(tagName);
  }

  const throwError = (message) => {
    const line = lineNum(template, index);
    throw new Error(`${message} (at line ${line})`);
  }



  const root = createNewElement(0, null, null, "html");
  // is this necessary?
  let curNode = root;
  parseWhiteSpace();
  while (index < template.length) {
    log(index);
    if (true) {
      // if (!stack[stack.length - 1]) {

      // Comment
      if (template.slice(index, index + 4) === '<!--') {
        index = template.indexOf('-->', index);
        if (index != -1) {
          // TODO handle comment later
          index += 3;
        }

        // Closing tag
      } else if (template.slice(index, index + 2) === '</') {
        match = template.slice(index, wholeLength).match(closingTag);
        if (!match) {
          throwError(`Expected > for closing tag`);
        }
        index += match[0].length;
        // match[0].replace(closingTag, (tag, tagName) => (tagName));
        if (match[1] !== stack[stack.length - 1]) {
          log(`match[0]=${match[0]}`)
          log(`stack[stack.length - 1]=${stack[stack.length - 1]}`)
          // throwError(`Expected ${stack[stack.length - 1]} but got ${match[0]}`);
        }
        stack.pop();
        curNode = curNode.parent;

        // Opening tag
      } else if (template.slice(index, index + 1) === '<') {
        log("Enter opening tag");
        match = template.slice(index, wholeLength).match(openingTag);
        log(`Opening tag, match = ${match}`)
        if (!match) {
          throwError(`Cannot match the opening tag`);
        }
        index += match[0].length;
        match[0].replace(openingTag, parseOpeningTag);
        // text
      } else {
        const endLocation = template.indexOf('<', index);
        const text = endLocation < 0
          ? template.slice(index, wholeLength)
          : template.slice(index, endLocation);
        index += text.length;
        const textElement = createNewElement(2, null, curNode, text);
        log(textElement)
        curNode.children.push(textElement);
      }
    }
    parseWhiteSpace();
  }





  return root;
};

