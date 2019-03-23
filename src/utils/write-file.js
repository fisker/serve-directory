import {writeFileSync, mkdirSync} from 'fs'
import {dirname} from 'path'
import {CHARSET} from '../constants'

function writeFile(file, content) {
  const dir = dirname(file)
  mkdirSync(dir, {
    recursive: true,
  })
  writeFileSync(file, content, CHARSET)
}

export default writeFile
