import {DEFAULT_HTML_TEMPLATE_FILE, EOL} from './constants'

function getFileNames({files}) {
  return files.map(file => file.name)
}

function defaultTextRender(data) {
  return getFileNames(data).join(EOL) + EOL
}

function defaultJSONRender(data) {
  return JSON.stringify(getFileNames(data))
}

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
      render: defaultTextRender,
    },
    {
      accept: 'application/json',
      render: defaultJSONRender,
    },
  ],
}
