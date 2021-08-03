import {readFileSync} from 'fs'
import {CHARSET} from '../constants.js'

function readFile(file) {
  try {
    return readFileSync(file, CHARSET)
  } catch {}
}

export default readFile
