import path from 'path'
import startsWithDot from './starts-with-dot.js'

function isHiddenPath(filePath) {
  return path
    .normalize(filePath)
    .split(path.sep)
    .some((segment) => startsWithDot(segment))
}

export default isHiddenPath
