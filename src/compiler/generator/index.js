

export default function generate (parsed) {

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
    })
    node.children.forEach(child => (generateNodesAndVarNames(child, index)));
  }

  const createNodeString = (node) =>{
    if (node.type == 'root') return ``
    const varName = varNames[node.index]
    switch (node.type) {
      case 'element':
        return `${varName} = document.createElement("${node.name}")`
      case 'text':
        // replace change line chararter
        return `${varName} = document.createTextNode("${node.name.replace(/\n/g, '\\n')}")`
    }
  }

  const mountNodeString = (node) => {
    // -1 represents root
    if (node.parentIndex !== -1){
      return `${varNames[node.parentIndex]}.appendChild(${varNames[node.index]})`
    } else {
      return `target.append(${varNames[node.index]})`
    }
  }

  parsed.children.forEach(child => generateNodesAndVarNames(child));

  const code = `
  function Component({target, props}) {
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
  }`

  return code;
}