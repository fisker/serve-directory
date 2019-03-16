const {toString} = Object.prototype

function type(x) {
  return toString.call(x).slice(8, -1)
}

export default type
