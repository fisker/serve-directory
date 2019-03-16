/* eslint-disable import/no-extraneous-dependencies, no-console */

const http = require('http')
const finalhandler = require('finalhandler')
const getPort = require('get-port')
const open = require('opn')
const serveDirectory = require('.')

const directory = serveDirectory('test/fixtures', {
  hidden: true,
})

const server = http.createServer(function onRequest(req, res) {
  const done = finalhandler(req, res)
  directory(req, res, done)
})

getPort({port: [3000, 3001, 3002]}).then(
  port => {
    server.listen(port)
    const url = `http://localhost:${port}`
    console.log(url)
    open(url)
    return true
  },
  error => console.error(error)
)
