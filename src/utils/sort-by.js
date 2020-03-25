function sortBy(key) {
  return function (a, b) {
    if (b[key] === a[key]) {
      return 0
    }

    return b[key] < a[key] ? 1 : -1
  }
}

export default sortBy
