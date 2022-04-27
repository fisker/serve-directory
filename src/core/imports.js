import createEsmUtils from 'esm-utils'
import * as utils from '../utils/index.js'
import {CHARSET} from '../constants.js'

const {require, readJsonSync} = createEsmUtils(import.meta)
const {name, version} = readJsonSync('../../package.json')

const packageJson = {
  name,
  version,
}

export default Object.freeze({
  CHARSET,
  pkg: packageJson,
  require,
  ...utils,
})
