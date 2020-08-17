import parse from './parser/index';
import generate from './generator/index';
const log = console.log

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

export default (template) => {
  const parsed = parse(template)
  const generated = generate(parsed)
  return generated
}