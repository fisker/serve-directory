import path from 'path'
import startsWithDot from './starts-with-dot'

function isHiddenPath(path) {
  return path
    .normalize(path)
    .split(path.sep)
    .some((segment) => startsWithDot(segment))
}

export default isHiddenPath
