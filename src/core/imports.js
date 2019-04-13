import * as utils from '../utils'
import {CHARSET} from '../constants'
import {name, version} from '../../package.json'

const package_ = {
  name,
  version,
}

export default Object.freeze({
  CHARSET,
  pkg: package_,
  require,
  ...utils,
})
