import directoryFirst from './directory-first.js'
import sortBy from './sort-by.js'

function sortFile(a, b) {
  return directoryFirst(a, b) || sortBy('name')(a, b)
}

export default sortFile
