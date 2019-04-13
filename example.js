const {createServer} = require('http')
const getPort = require('get-port')
const open = require('opn')
// eslint-disable-next-line import/no-unresolved
const serveDirectory = require('.')

const sd = serveDirectory('test/fixtures', {
  // hidden: true,
})

const listener = (request, response) =>
  sd(request, response, error => {
    console.trace(error)
    const {status = 'unkown', message = 'not handled.'} = {}
    response.end(`${status}: ${message}`)
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
