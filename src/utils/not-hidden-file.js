import isHiddenFile from './is-hidden-file.js'

function notHiddenFile(file) {
  return !isHiddenFile(file)
}

export default notHiddenFile
