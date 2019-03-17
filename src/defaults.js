import {DEFAULT_HTML_TEMPLATE_FILE, EOL} from './constants'

export default {
  hidden: false,
  relative: true,
  process: [
    {
      accept: 'text/html',
      render: DEFAULT_HTML_TEMPLATE_FILE,
    },
    {
      accept: 'text/plain',
      render: ({fileNames}) => fileNames.join(EOL) + EOL,
    },
    {
      accept: 'application/json',
      render: ({fileNames}) => JSON.stringify(fileNames),
    },
  ],
}
