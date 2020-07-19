import parse from './parser/index.mjs';
const log = console.log;

const template = "<div> hello world </div>"
log(parse(template))