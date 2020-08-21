import handleScript from './utils/handleScript'
import { scriptEnd } from '../parser/utils/patterns';

export default (parsed) => {

  // TODO CSS

  // const tops = [];
  const nodes = [];
  const vars = [];
  const curlyMapping = {};
  const forVars = [];
  let count = 0;
  let forStatement

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
          node.attrs.forEach(entry => {
            if (entry.value.startsWith('data.')){
              const name = entry.value.slice(5)
              if (curlyMapping[name]) curlyMapping[name].push(varName)
              else curlyMapping[name] = [varName]
            }
            result.push(`${varName}.setAttribute("${entry.key}", ${entry.value})`)
          })
        }
        if (node.listeners && node.listeners.length !== 0) {
          node.listeners.forEach(entry => {
            if (entry.value) result.push(`${varName}.addEventListener("${entry.key}", ${entry.value})`)})
        }
        return result.join('\n')
      case 'text':
        // replace change line chararter
        return `${varName} = document.createTextNode("${node.name.replace(/\n/g, '\\n')}")`
      case 'curly':
        if (node.name.startsWith('data.')){
          const name = node.name.slice(5)
          if (curlyMapping[name]) curlyMapping[name].push(varName)
          else curlyMapping[name] = [varName]
        }
        return `${varName} = document.createTextNode(${node.name})`
      case 'for':
        forStatement = node.name
        const mapIndex = node.name.indexOf('.map')
        return `${varName} = document.createElement("div")\n \
        ${varName}.innerHTML = ${node.name}.join('')\n \
        ${node.name.startsWith('data.') && `mapList('${node.name.slice(5, mapIndex)}', ${varName})`}`
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

  const returnPartCode = `
  return {
    create() {
      ${nodes.map(node => createNode(node)).join('\n')}
      ${Object.keys(curlyMapping).map((key) => (
        `mapValue('${key}', [${curlyMapping[key]}])`
      )).join('\n')}
    },
    mount() {
      ${nodes.map(node => mountNode(node)).join('\n')}
    },
    update(changes) {
      // TODO for props use
    },
    detach() {
      ${nodes.map(node => detach(node)).join('\n')}
    }
  }
}`



  const code = `

function Component({target, props}) {
  // TODO: props
  let ${vars.join(',')}
  
  ${parsed.script}
  ${(curlyMapping && Object.entries(curlyMapping).length !== 0) &&
  `mapValue = (stateName, nodes) => { 
    const defaultValue = data[stateName]
    Object.defineProperty(data, stateName, {
      get: () => {
        return this.value;
      },
      set: (newValue) => { 
        nodes.forEach(node => {
          if (node.nodeType === 3)  node.nodeValue = newValue
          else {
            node.value = newValue
          }
        })
        this.value = newValue;
     },
     configurable: true
    })
    data[stateName] = defaultValue
  }`}

  ${forStatement && `
  // temporarily only support one for block
  mapList = (stateName, node) => { 
    const defaultValue = data[stateName]
    Object.defineProperty(data, stateName, {
      get: () => {
        return this.value;
      },
      set: (newValue) => { 
        this.value = newValue;
        node.innerHTML = ${forStatement}.join('')
     },
     configurable: true
    })
    data[stateName] = defaultValue
  }`}
` + returnPartCode

  return code;
}


