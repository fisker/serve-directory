/* eslint-disable import/no-extraneous-dependencies, no-console */

const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')
const getPort = require('get-port')
const open = require('opn')
const serveDirectory = require('.')

const directory = serveDirectory('test/fixtures')
const staticServer = serveStatic('test/fixtures')

const server = http.createServer(function onRequest(req, res) {
  const done = finalhandler(req, res)

  staticServer(req, res, function onNext(err) {
    return err ? done(err) : directory(req, res, done)
  })
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
