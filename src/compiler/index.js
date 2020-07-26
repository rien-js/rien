import parse from './parser/index';
import generate from './generator/index';
const log = console.log

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


<div>`
// const template = fs.readFileSync('example/helloWorld.rien');
const parsed = parse(template);
// log (parsed);
// log ('------------------------------------------------------')
const generated = generate(parsed);
log(generated);

