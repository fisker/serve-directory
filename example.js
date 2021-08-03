import {createServer} from 'node:http'
import getPort from 'get-port'
import open from 'open'
import serveDirectory from './dist/index.js'

const sd = serveDirectory('test/fixtures', {
  // hidden: true,
})

const listener = (request, response) =>
  sd(request, response, (error) => {
    console.trace(error)
    const {status = 'unknown', message = 'not handled.'} = error || {}
    response.end(`${status}: ${message}`)
  })

getPort({port: 3000}).then(
  (port) => {
    createServer(listener).listen(port)

    const url = `http://localhost:${port}`

    console.log(`listening on ${url}`)

    return open(url)
  },
  (error) => console.error(error)
)
