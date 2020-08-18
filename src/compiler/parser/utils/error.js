export function ParseError ( message, template, index ) {
  const lines = template.slice(0, index + 1).split( '\n' )
  const line = lines.length

  this.type = 'ParseError';
  // this.location = { line: line + 1};
	this.message = `ParseError: ${message} at line: ${line}`;
}