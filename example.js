import {createServer} from 'node:http'
import getPort from 'get-port'
import open from 'open'
import serveDirectory from './dist/index.js'

const sd = serveDirectory('test/fixtures', {
  // hidden: true,
})

const listener = (request, response) =>
  sd(request, response, (error) => {
    if (!error) {
      return
    }
    console.trace(error)
    const {status = 'unknown', message = 'not handled.'} = error || {}
    response.end(`${status}: ${message}`)
  })

const port = await getPort({port: 3000})

createServer(listener).listen(port)

const url = `http://localhost:${port}`

console.log(`listening on ${url}`)

open(url)
