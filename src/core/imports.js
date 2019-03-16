import * as utils from '../utils/index'
import {CHARSET} from '../constants'
import {name, version} from '../../package.json'

const pkg = {
  name,
  version,
}

export default Object.freeze({
  CHARSET,
  pkg,
  require,
  ...utils,
})
