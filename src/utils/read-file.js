import {readFileSync} from 'fs'
import {CHARSET} from '../constants'

function readFile(file) {
  try {
    return readFileSync(file, CHARSET)
  } catch (error) {
    return ''
  }
}

export default readFile
