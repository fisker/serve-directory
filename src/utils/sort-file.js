import directoryFirst from './directory-first'
import sortBy from './sort-by'

function sortFile(a, b) {
  return directoryFirst(a, b) || sortBy('name')(a, b)
}

export default sortFile
