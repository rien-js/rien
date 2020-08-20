export default (parsedScript) => {
  const props = []
  const statements = []

  if (parsedScript) {
    parsedScript.body.forEach(declaration => {
      // TODO
    })
  }

  return { props, statements }
}