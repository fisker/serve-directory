import {readFileSync} from 'fs'
import {CHARSET} from '../constants'

function readFile(file) {
  try {
    return readFileSync(file, CHARSET)
    // mocha and rollup can't work with optional-catch-binding
    // } catch {}
  } catch (error) {}
  return null
}

export default readFile
