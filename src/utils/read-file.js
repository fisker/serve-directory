import {readFileSync} from 'fs'
import {CHARSET} from '../constants'

function readFile(file) {
  try {
    return readFileSync(file, CHARSET)
  } catch {}
  return null
}

export default readFile
