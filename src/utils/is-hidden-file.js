import startsWithDot from './starts-with-dot'

function isHiddenFile(file) {
  return startsWithDot(file.name)
}

export default isHiddenFile
