function isHiddenFile(file) {
  return file.name[0] === '.'
}

export default isHiddenFile
