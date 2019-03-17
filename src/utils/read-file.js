import {readFileSync} from 'fs'
import {CHARSET} from '../constants'

function readFile(file) {
  try {
    return readFileSync(file, CHARSET)
    // TODO: use following instead when targeting node v10
    // } catch {}
  } catch (error) {}

  return null
}

export default readFile
