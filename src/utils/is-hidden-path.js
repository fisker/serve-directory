import {sep as separator, normalize} from 'path'
import startsWithDot from './starts-with-dot'

function isHiddenPath(path) {
  return normalize(path)
    .split(separator)
    .some(startsWithDot)
}

export default isHiddenPath
