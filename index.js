'use strict';

const whiteSpace = /\s/;
const closingTag = /<\s*\/\s*([a-zA-Z]+)\s*>/;
const openingTag = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
const attribute = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g;

// const template = `<div class='child'><span>asdf</span></div>`;
// let doc = parse(template, 'text/html');
// console.log(doc);


// not support for attributes yet

const generateMap = (string) => {
  const map = {};
  const items = string.split(',');
  items.forEach((item) => {
    map[item.trim()] = true;
  });
  return map;
};

const blockElements = generateMap("address, article, aside, blockquote, \
  canvas, dd, div, dl, dt, fieldset, figcaption, figure, footer, form, \
  h1, h2, h3, h4, h5, h6, header, hr, li, main, nav, noscript, ol, p, \
  pre, section, table, tfoot, ul, video");

const inlineElements = generateMap("a, abbr, acronym, b, bdo, big, br, \
  button, cite, code, dfn, em, i, img, input, kbd, label, map, object, \
  output, q, samp, script, select, small, span, strong, sub, sup, textarea, \
  time, tt, var>");

function parse(template) {
  let index = 0;
  let stack = [];
  let match;
  const wholeLength = template.length;

  // Is parent necessary?
  const createNewElement = (type, attrs, parent, name) => {
    return {
      type,
      name,
      attrs,
      parent,
      children: []
    };
  };

  const parseWhiteSpace = () => {
    while (index < template.length &&
      whiteSpace.test(template[index])) {
      index++;
    }
  };

  const parseOpeningTag = (tag, tagName, attributes, rest) => {
    // TODO handle tags like <li>
    // handle tags self closed
    const attrs = [];
    if (attributes) {
      let lexicalMatch;
      while (lexicalMatch = attributes.exec(attribute)) {
        attrs[lexicalMatch[1]] = lexicalMatch[2];
      }
    }
    const newElement = createNewElement('element', attrs, curNode, tagName);
    curNode.children.push(newElement);
    curNode = newElement;
    stack.push(tagName);
  };

  const throwError = (message) => {
    const line = lineNum(template, index);
    throw new Error(`${message} (at line ${line})`);
  };



  const root = createNewElement('root', null, null, "html");
  // is this necessary?
  let curNode = root;
  parseWhiteSpace();
  while (index < template.length) {
    {
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
        if (match[1] !== stack[stack.length - 1]) ;
        stack.pop();
        curNode = curNode.parent;

        // Opening tag
        // TODO: handle script and styles specially
      } else if (template.slice(index, index + 1) === '<') {
        match = template.slice(index, wholeLength).match(openingTag);
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
        const textElement = createNewElement('text', null, curNode, text);
        curNode.children.push(textElement);
      }
    }
    parseWhiteSpace();
  }

  return root;
}

function generate (parsed) {

  // TODO script and CSS

  const nodes = [];
  const varNames = [];
  let count = 0;

  const generateNodesAndVarNames = (node, parentIndex) => {
    const varName = node.type[0] + count;
    const index = count++;
    varNames.push(varName);
    nodes.push({
      type: node.type,
      name: node.name,
      index,
      attrs: node.attrs,
      parentIndex: node.parent.type !== 'root' ? parentIndex : -1
    });
    node.children.forEach(child => (generateNodesAndVarNames(child, index)));
  };

  const createNodeString = (node) =>{
    if (node.type == 'root') return ``
    const varName = varNames[node.index];
    switch (node.type) {
      case 'element':
        return `${varName} = document.createElement("${node.name}")`
      case 'text':
        // replace change line chararter
        return `${varName} = document.createTextNode("${node.name.replace(/\n/g, '\\n')}")`
    }
  };

  const mountNodeString = (node) => {
    // -1 represents root
    if (node.parentIndex !== -1){
      return `${varNames[node.parentIndex]}.appendChild(${varNames[node.index]})`
    } else {
      return `target.append(${varNames[node.index]})`
    }
  };

  parsed.children.forEach(child => generateNodesAndVarNames(child));

  const code = `
  function component({target, props}) {
    // TODO: props for variables
    // TODO: functions declared
    let ${varNames.join(',')}
    return {
      create() {
        ${nodes.map(node => createNodeString(node)).join('\n')}
       // TODO attributes and eventsListeners 
      },
      mount() {
        ${nodes.map(node => mountNodeString(node)).join('\n')}
      },
      update(changes) {
        // TODO
      },
      detach() {
        // TODO
      }
    }
  }
  const c = component({target: document.body});
  c.create();
  c.mount();`;

  return code;
}

const log = console.log;

// import fs from 'fs';

// function compile(template){
//   const parsed = parse(template);
//   const generated = generate(parsed);
//   return generated;
// }
// export {compile};
// const template = fs.readFileSync(process.argv[2]);
// const parsed = parse(template);
// const generated = generate(parsed);
// console.log(generated);

const template = `<div>
<h1>Hello World!</h1>
<div>This may look like original html file, but actually it is not.</div>
<div>There are plenty of things happening under the hood.</div>
<div>My framework parsed the original html template at first, and then generate the component that you can read right now.</div>
<div>Note that there is no html file at all, the content here are all created by DOM operation.</div>
<div>By doing so, we could have access to all the node in the DOM and directly update them using some functions that I provided:</div>
<div>create(), mount(), update(change), and detach()</div>
<div>Enjoy!</div>


<div>`;
// const template = fs.readFileSync('example/helloWorld.rien');
const parsed = parse(template);
// log (parsed);
// log ('------------------------------------------------------')
const generated = generate(parsed);
log(generated);
