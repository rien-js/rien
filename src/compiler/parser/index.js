import { parse } from 'acorn';
import { whiteSpace, openingTag, closingTag, attribute, scriptEnd } from './utils/patterns.js';
import { ParseError } from './utils/error';

const log = console.log;


// const template = `<div class='child'><span>asdf</span></div>`;
// let doc = parse(template, 'text/html');
// console.log(doc);


// not support for attributes yet

// const generateMap = (string) => {
//   const map = {};
//   const items = string.split(',');
//   items.forEach((item) => {
//     map[item.trim()] = true;
//   })
//   return map;
// }

// const blockElements = generateMap("address, article, aside, blockquote, \
//   canvas, dd, div, dl, dt, fieldset, figcaption, figure, footer, form, \
//   h1, h2, h3, h4, h5, h6, header, hr, li, main, nav, noscript, ol, p, \
//   pre, section, table, tfoot, ul, video");

// const inlineElements = generateMap("a, abbr, acronym, b, bdo, big, br, \
//   button, cite, code, dfn, em, i, img, input, kbd, label, map, object, \
//   output, q, samp, script, select, small, span, strong, sub, sup, textarea, \
//   time, tt, var>");

export default (template) => {
  let index = 0
  let stack = []
  let match
  const wholeLength = template.length
  let parsedScript
  let script

  // Is parent necessary?
  const createNewElement = (type, attrs, parent, name, listeners) => {
    return {
      type,
      name,
      attrs,
      parent,
      listeners,
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
    const attrs = [];
    const listeners = [];
    if (attributes) {
      log("attrs")
      log(attributes)
      let match;
      while (match = attribute.exec(attributes)) {
        log(match)
        if (match[1].startsWith('r-on')) {
          if (match[2]!==''){
          // event listener
            log("success")
            listeners.push({ key: match[1].slice(4).toLowerCase(), value: match[6] })
          }
        } else {
          if (match[3]) attrs.push({ key: match[1], value: match[2] })
          else if (match[5]) attrs.push({ key: match[1], value: match[6] })
        }
      }
    }
    const newElement = createNewElement('element', attrs, curNode, tagName, listeners);
    curNode.children.push(newElement);
    curNode = newElement;
    stack.push(tagName);
  }

  const throwError = (message, template, index) => {
    throw new ParseError(message, template, index);
  }



  const root = createNewElement('root', null, null, "html");
  // is this necessary?
  let curNode = root;
  parseWhiteSpace();
  while (index < template.length) {
    if (true) {
      // if (!stack[stack.length - 1]) {


      if (template.slice(index, index + 4) === '<!--') {
        // Comment
        index = template.indexOf('-->', index);
        if (index != -1) {
          // TODO handle comment later
          index += 3;
        }


      } else if (template.slice(index, index + 2) === '</') {
        // Closing tag
        match = template.slice(index, wholeLength).match(closingTag);
        if (!match) {
          throwError(`Expected '>' for closing tag`, template, index);
        }
        index += match[0].length;
        if (match[1] !== stack[stack.length - 1]) {
          // log(`match[0]=${match[0]}`)
          // log(`stack[stack.length - 1]=${stack[stack.length - 1]}`)
          throwError(`Expected </${stack[stack.length - 1]}> but got ${match[0]}`, template, index);
        }
        if (match[1] !== "script")
          curNode = curNode.parent;
        stack.pop()

      } else if (template.slice(index, index + 1) === '<') {
        // Opening tag
        // TODO: handle styles specially
        match = template.slice(index, wholeLength).match(openingTag);
        if (!match) {
          throwError(`Cannot match the opening tag`, template, index);
        }
        index += match[0].length;
        if (match[1] === "script") {
          // parse script here
          if (parsedScript) throwError(`A component could only have one script element`, template, index) 
          stack.push("script");
          const endIndex = template.slice(index).search(scriptEnd)
          if (endIndex) {
            const endLocation = endIndex + index
            const scriptContent = template.slice(index, endLocation)
            // if (scriptContent) {
              script = scriptContent
              log(`script=${scriptContent}`)
              parsedScript = parse(scriptContent, { ecmaVersion: 2017 })
              log(parsedScript)
            // }   
            index = endLocation
          }
        } else {
          match[0].replace(openingTag, parseOpeningTag);
        }

      } else if (template.slice(index, index + 1) === '{') {
        // curly braces
        index++
        const curlyEnd = template.indexOf('}', index)
        if (curlyEnd === -1) throwError(`Expected close of {}`, template, index)
        const curlyContent = template.slice(index, curlyEnd).trim()
        index = curlyEnd + 1
        if (curlyContent !== ''){
          const curlyElement = createNewElement('curly', null, curNode, curlyContent)
          curNode.children.push(curlyElement)
        } 
      } else {
        // text
        const nextArrow = template.indexOf('<', index)
        const nextCurly = template.indexOf('{', index)
        const endLocation = nextArrow === -1
          ? nextCurly
          : (nextArrow > nextCurly && nextCurly !== -1) ? nextCurly : nextArrow
        const text = endLocation < 0
          ? template.slice(index)
          : template.slice(index, endLocation);
        // index += text.length;
        index = endLocation
        const textElement = createNewElement('text', null, curNode, text);
        curNode.children.push(textElement);
      }
    }
    parseWhiteSpace();
  }
  if (stack.length !== 0) {
    throwError(`Expected </${stack[stack.length - 1]}>`, template, index);
  }

  return {root, script, parsedScript};
};

