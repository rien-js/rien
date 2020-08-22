
const log = console.log

const resultBlock = document.getElementById("result-block")
const resultPage = document.createElement('div')
resultBlock.appendChild(resultPage)

// codemirror editor
let myTextArea
let editor

//#2c5466
// #263238

myTextArea = document.getElementById('editor-text-0')
  editor = CodeMirror.fromTextArea(myTextArea, {
    lineNumbers: true,
    mode: 'jsx',
    htmlMode: true,
    theme: 'material',
    lineWrapping: true
  });



const getEditor = (id) => {
  myTextArea = document.getElementById('editor-text-'+id)
  editor.getDoc().setValue(myTextArea.value);
}

const files = document.getElementsByClassName("rien-file")

let fileNode = files[0]
fileNode.setAttribute('style', 'background-color: #263238;')

for (let i = 0; i< files.length; i++){
  files[i].addEventListener("click", ()=>{
    fileNode.setAttribute('style', 'background-color: #2c5466;')
    getEditor(i)
    fileNode = files[i]
    fileNode.setAttribute('style', 'background-color: #263238;')
  })
}



const errorNode = document.getElementById("error-message")
const updateError = (isError, value) =>{
  const visibility = isError ? "visible" : "hidden"
  errorNode.style.visibility =  visibility
  errorNode.innerText = isError ? value : ''
}


let code, compiled, c;

const updateContent = () =>{
  updateError(false)
  code = editor.getValue()
  try {
    compiled = rien(code)
  } catch (e) {
    // if (e.type === 'SyntaxError') log(e);
    // else if (e.type !== 'ParseError') throw e;
    updateError(true, e.message)
  }
  try {
    eval(compiled);
    c = Component({ target: resultPage });
    c.create();
    c.mount(); 
  } catch (e) {
    updateError(true, e.message)
  }
}

updateContent();

editor.on('change', () => {
  try {
    c.detach();
  } catch (e) {}
  updateContent();
});

