function directoryFirst(a, b) {
  return b.isDirectory() - a.isDirectory()
}

export default directoryFirst
