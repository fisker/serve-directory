import _ from './utils'

export default {
  hidden: false,
  relative: true,
  process: [
    {
      accept: 'text/html',
      render: _.path.join(__dirname, 'directory.ejs'),
    },
    {
      accept: 'text/plain',
      render(data) {
        return `${data.files.map(file => file.name).join('\n')}\n`
      },
    },
    {
      accept: 'application/json',
      render(data) {
        return JSON.stringify(data.files.map(file => file.name))
      },
    },
  ],
}
