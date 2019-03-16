import isHiddenFile from './is-hidden-file'

function notHiddenFile(file) {
  return !isHiddenFile(file)
}

export default notHiddenFile
