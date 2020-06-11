import * as utils from '../utils'
import {CHARSET} from '../constants'
import {name, version} from '../../package.json'

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
