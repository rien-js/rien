

export default function generate (parsed) {

  // TODO script and CSS

  const roots = [];
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
      parentIndex: node.parent.type !== 'root' ? parentIndex : -1
    }
    nodes.push(toAdd)
    if (toAdd.parentIndex == -1) roots.push(toAdd)
    node.children.forEach(child => (generateNodesAndVars(child, index)));
  }

  const createNodeString = (node) =>{
    if (node.type == 'root') return ``
    const varName = vars[node.index]
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
      return `${vars[node.parentIndex]}.appendChild(${vars[node.index]})`
    } else {
      return `target.append(${vars[node.index]})`
    }
  }

  parsed.children.forEach(child => generateNodesAndVars(child));

  const code = `
  function Component({target, props}) {
    // TODO: props for variables
    // TODO: functions declared
    let ${vars.join(',')}
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
        ${roots.map(node => `target.removeChild(${vars[node.index]})`).join('\n')}
      }
    }
  }`

  return code;
}