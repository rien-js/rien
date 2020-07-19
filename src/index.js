const log = console.log
const root = {
  msg: 'hello, world'
};
let h1 = document.createElement('h1')
let text = document.createTextNode(root.msg);
h1.appendChild(text)
document.body.appendChild(h1)