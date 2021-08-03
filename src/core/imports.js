import createEsmUtils from 'esm-utils'
import * as utils from '../utils/index.js'
import {CHARSET} from '../constants.js'

const {require, json} = createEsmUtils(import.meta)
const {name, version} = json.loadSync('../../package.json')

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
