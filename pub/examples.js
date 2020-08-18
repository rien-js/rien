
const log = console.log


const resultBlock = document.getElementById("result-block")
const resultPage = document.createElement('div')
resultBlock.appendChild(resultPage)

// codemirror editor
const myTextArea = document.getElementById('editor-text')
const editor = CodeMirror.fromTextArea(myTextArea, {
  lineNumbers: true,
  mode: 'htmlmixed',
  htmlMode: true,
  theme: 'material',
  lineWrapping: true
});

let code = editor.getValue();
console.log(code)
let compiled = rien(code)
log(compiled)
eval(compiled);
let c = Component({ target: resultPage });
c.create();
c.mount();


editor.on('change', () => {
  c.detach();
  delete(c);
  code = editor.getValue()
  compiled = rien(code)
  log(compiled)
  eval(compiled);
  c = Component({ target: resultPage });
  c.create();
  c.mount();
});


// const codeNode = document.getElementById("editor-text")
// const code = codeNode.textContent






// function component({target, props}) {
//     // TODO: props for variables
//     // TODO: functions declared
//     let e0,e1,t2,e3,t4,e5,t6,e7,t8,e9,t10,e11,t12,e13,t14,e15,t16,e17
//     return {
//       create() {
//         e0 = document.createElement("div")
// e1 = document.createElement("h1")
// t2 = document.createTextNode("Hello World!")
// e3 = document.createElement("div")
// t4 = document.createTextNode("This may look like original html file, but actually it is not.")
// e5 = document.createElement("div")
// t6 = document.createTextNode("There are plenty of things happening under the hood.")
// e7 = document.createElement("div")
// t8 = document.createTextNode("My framework parsed the original html template at first, and then generate the component that you can read right now.")
// e9 = document.createElement("div")
// t10 = document.createTextNode("Note that there is no html file at all, the content here are all created by DOM operation.")
// e11 = document.createElement("div")
// t12 = document.createTextNode("By doing so, we could have access to all the node in the DOM and directly update them using some functions that I provided:")
// e13 = document.createElement("div")
// t14 = document.createTextNode("create(), mount(), update(change), and detach()")
// e15 = document.createElement("div")
// t16 = document.createTextNode("Enjoy!")
// e17 = document.createElement("div")
//        // TODO attributes and eventsListeners 
//       },
//       mount() {
//         target.append(e0)
// e0.appendChild(e1)
// e1.appendChild(t2)
// e0.appendChild(e3)
// e3.appendChild(t4)
// e0.appendChild(e5)
// e5.appendChild(t6)
// e0.appendChild(e7)
// e7.appendChild(t8)
// e0.appendChild(e9)
// e9.appendChild(t10)
// e0.appendChild(e11)
// e11.appendChild(t12)
// e0.appendChild(e13)
// e13.appendChild(t14)
// e0.appendChild(e15)
// e15.appendChild(t16)
// e0.appendChild(e17)
//       },
//       update(changes) {
//         // TODO
//       },
//       detach() {
//         // TODO
//       }
//     }
//   }




