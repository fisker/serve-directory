import fs from 'fs'
import path from 'path'
import {CHARSET} from '../constants'

function writeFile(file, content) {
  const directory = path.dirname(file)
  fs.mkdirSync(directory, {
    recursive: true,
  })
  fs.writeFileSync(file, content, CHARSET)
}

export default writeFile
