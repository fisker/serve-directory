import debug from 'debug'

import createEsmUtils from 'esm-utils'

const {json} = createEsmUtils(import.meta)
const {name} = json.loadSync('../../package.json')

export default debug(name)
