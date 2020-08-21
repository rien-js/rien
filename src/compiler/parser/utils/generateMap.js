export default (items) => {
  const map = {}
  items.forEach((item) => {
    map[item.trim()] = true;
  })
  return map;
}