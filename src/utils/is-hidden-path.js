import {sep, normalize} from 'path'
import startsWithDot from './starts-with-dot'

function isHiddenPath(path) {
  return normalize(path)
    .split(sep)
    .some(startsWithDot)
}

export default isHiddenPath
