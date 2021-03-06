import { parse, parseExpressionAt } from 'acorn';
import { selfClosingElements } from './utils/elements';
import { whiteSpace, openingTag, closingTag, attribute, scriptEnd } from './utils/patterns.js';
import { ParseError } from './utils/error';
// I imported parse and parseExpressionAt at this place

const log = console.log;

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
    const attrs = [];
    const listeners = [];
    if (attributes) {
      log("attrs")
      log(attributes)
      let match;
      while (match = attribute.exec(attributes)) {
        log(match)
        if (match[1].startsWith('r-on')) {
          // if (match[6]!==''){
          // event listener
          listeners.push({ key: match[1].slice(4).toLowerCase(), value: match[6] })

          // const expression = parseExpressionAt(match[6])
          // if ( expression.type !== 'CallExpression' ) {
          //   throwError( `Expected call expression`, template, index );
          // }
          // listeners.push({ key: match[1].slice(4).toLowerCase(), value: expression })
          // }
        } else if (match[1] === 'r-bind') {
          // data binding
          if (!match[6]) continue
          switch (tagName) {
            case 'textarea':
              attrs.push({ key: "value", value: match[6] })
              listeners.push({ key: "input", value: `(e)=>{${match[6]} = e.target.value}` })
            case 'select':
              attrs.push({ key: "value", value: match[6] })
              listeners.push({ key: "change", value: `(e)=>{${match[6]} = e.target.value}` })
            case 'input':
              // TODO: handle different kinds of input, for now just handle text.
              attrs.push({ key: "value", value: match[6] })
              listeners.push({ key: "input", value: `(e)=>{${match[6]} = e.target.value}` })
          }
        } else {
          if (match[3]) attrs.push({ key: match[1], value: match[2] })
          // curly attributes
          else if (match[5]) attrs.push({ key: match[1], value: match[6] })
        }
      }
    }
    const newElement = createNewElement('element', attrs, curNode, tagName, listeners);
    curNode.children.push(newElement);
    if (!selfClosingElements[tagName]) {
      curNode = newElement;
      stack.push(tagName);
    }
    log('stack:')
    log(stack)

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
          // maybe handle comment later or not 
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
            // I used parse() from 'acorn' at this place
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

        // simple for loop rendering
        parseWhiteSpace()
        if (template.slice(index, index + 5) === 'r-for') {
          index += 5
          log('successfully got r-for')
          const forEnd = template.indexOf('r-end}', index)
          if (forEnd === -1) throwError(`Expected r-end of for rendering block`, template, index)
          const forContent = template.slice(index, forEnd).trim()
          if (forContent !== ''){
            const forElement = createNewElement('for', null, curNode, forContent)
            curNode.children.push(forElement)
          }
          index = forEnd + 6
        }
        else {
          const curlyEnd = template.indexOf('}', index)
          if (curlyEnd === -1) throwError(`Expected close of {}`, template, index)
          const curlyContent = template.slice(index, curlyEnd).trim()
          if (curlyContent !== '') {
            const curlyElement = createNewElement('curly', null, curNode, curlyContent)
            curNode.children.push(curlyElement)
          }
          index = curlyEnd + 1
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

  return { root, script, parsedScript };
};

