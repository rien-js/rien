export function ParseError ( message, template, index ) {
  const lines = template.slice(0, index + 1).split( '\n' )
  // line could not be 0 since empty could not cause error
  const line = lines.length
  let column = index;
  for (let i = 1; i < line ; i++){
    log(column)
    column -= lines[i - 1].length
  }

  this.type = 'ParseError';
  // this.location = { line: line + 1};
	this.message = `ParseError: ${message} at ${line}:${column}}`;
}
