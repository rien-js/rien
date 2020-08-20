import handleScript from './utils/handleScript'
import { scriptEnd } from '../parser/utils/patterns';

export default (parsed) => {

  // TODO script and CSS

  // const tops = [];
  const nodes = [];
  const vars = [];
  let count = 0;

  const generateNodesAndVars = (node, parentIndex) => {
    const varName = node.type[0] + count;
    const index = count++;
    vars.push(varName);
    const toAdd = {
      type: node.type,
      name: node.name,
      index,
      attrs: node.attrs,
      listeners: node. listeners,
      parentIndex: node.parent.type !== 'root' ? parentIndex : -1
    }
    nodes.push(toAdd)
    // if (toAdd.parentIndex === -1) tops.push(toAdd)
    node.children.forEach(child => (generateNodesAndVars(child, index)));
  }

  const createNode = (node) =>{
    if (node.type == 'root') return ``
    const varName = vars[node.index]
    switch (node.type) {
      case 'element':
        let result = [`${varName} = document.createElement("${node.name}")`]
        // add attrs if there is any
        if (node.attrs && node.attrs.length !== 0) {
          node.attrs.forEach(entry => result.push(`${varName}.setAttribute("${entry.key}", ${entry.value})`))
        }
        log("listeners:")
        log(node.listeners)
        if (node.listeners && node.listeners.length !== 0) {
          node.listeners.forEach(entry => result.push(`${varName}.addEventListener("${entry.key}", ${entry.value})`))
        }
        return result.join('\n')
      case 'text':
        // replace change line chararter
        return `${varName} = document.createTextNode("${node.name.replace(/\n/g, '\\n')}")`
      case 'curly':
        return `${varName} = document.createTextNode(${node.name})`
    }
  }

  const mountNode = (node) => {
    // -1 represents root
    if (node.parentIndex !== -1){
      return `${vars[node.parentIndex]}.appendChild(${vars[node.index]})`
    } else {
      return `target.append(${vars[node.index]})`
    }
  }

  const detach = (node) => {
    if (node.parentIndex === -1){
      return `target.removeChild(${vars[node.index]})`
    }
  }

  parsed.root.children.forEach(child => generateNodesAndVars(child));
  // const {props, statements} = handleScript(parsed.parsedScript)

  const code = `

  function Component({target, props}) {
    // TODO: props for variables
    
    ${parsed.script}

    let ${vars.join(',')}
    return {
      create() {
        ${nodes.map(node => createNode(node)).join('\n')}
      },
      mount() {
        ${nodes.map(node => mountNode(node)).join('\n')}
      },
      update(changes) {
        // TODO
      },
      detach() {
        ${nodes.map(node => detach(node)).join('\n')}
      }
    }
  }`
  log(nodes)
  return code;
}


