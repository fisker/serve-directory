import startsWithDot from './starts-with-dot.js'

function isHiddenFile(file) {
  return startsWithDot(file.name)
}

export default isHiddenFile
