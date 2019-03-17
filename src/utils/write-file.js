import {writeFileSync, mkdirSync} from 'fs'
import {dirname} from 'path'
import {CHARSET} from '../constants'

function writeFile(file, content) {
  mkdirSync(dirname(file), {
    recursive: true,
  })
  writeFileSync(file, content, CHARSET)
}

export default writeFile
