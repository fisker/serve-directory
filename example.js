const {createServer} = require('http')
const getPort = require('get-port')
const open = require('opn')
const serveDirectory = require('.')

const sd = serveDirectory('test/fixtures', {
  // hidden: true,
})

const listener = (req, res) =>
  sd(req, res, ({status = 'unkown', message = 'not handled.'} = {}) => {
    res.end(`${status}: ${message}`)
  })

getPort({port: 3000}).then(
  port => {
    createServer(listener).listen(port)

    const url = `http://localhost:${port}`

    console.log(`listening on ${url}`)

    return open(url)
  },
  error => console.error(error)
)
