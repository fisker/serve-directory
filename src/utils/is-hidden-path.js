import {sep, normalize} from 'path'

function startsWithDot(file) {
  return file[0] === '.'
}

function isHiddenPath(path) {
  return normalize(path)
    .split(sep)
    .some(startsWithDot)
}

export default isHiddenPath
