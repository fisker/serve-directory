import {assert} from 'chai'
import http from 'http'
import fs from 'fs'
import path from 'path'
import request from 'supertest'
import serveDirectory from '../src'

const fixtures = path.join(__dirname, '/fixtures')
const relative = path.relative(process.cwd(), fixtures)

const skipRelative =
  relative.includes('..') || path.resolve(relative) === relative
const customTemplate = {
  process: [
    {
      accept: 'text/html',
      render: path.join(__dirname, '/shared/template.html'),
    },
  ],
}

describe('serveDirectory(root)', function() {
  it('should require root', function() {
    assert.throws(serveDirectory, TypeError)
  })

  it('should serve text/html without Accept header', function(done) {
    const server = createServer()

    request(server)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done)
  })

  it('should include security header', function(done) {
    const server = createServer()

    request(server)
      .get('/')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200, done)
  })

  it('should serve a directory index', function(done) {
    const server = createServer()

    request(server)
      .get('/')
      .expect(200, /todo\.txt/, done)
  })

  it('should work with HEAD requests', function(done) {
    const server = createServer()

    request(server)
      .head('/')
      .expect(200, /^(undefined|)$/, done)
  })

  it('should work with OPTIONS requests', function(done) {
    const server = createServer()

    request(server)
      .options('/')
      .expect('Allow', 'GET, HEAD, OPTIONS')
      .expect(200, done)
  })

  it('should deny POST requests', function(done) {
    const server = createServer()

    request(server)
      .post('/')
      .expect(405, done)
  })

  it('should rediret when path not end with /', function(done) {
    const server = createServer()

    request(server)
      .get('/users')
      .expect(301, done)
  })

  it('should deny path will NULL byte', function(done) {
    const server = createServer()

    request(server)
      .get('/%00/')
      .expect(400, done)
  })

  it('should deny path outside root', function(done) {
    const server = createServer()

    request(server)
      .get('/../')
      .expect(403, done)
  })

  it('should skip non-existent paths', function(done) {
    const server = createServer()

    request(server)
      .get('/bogus/')
      .expect(404, 'Not Found', done)
  })

  // disable this failed test
  // https://github.com/expressjs/serve-index/issues/89
  // https://github.com/nodejs/node/issues/26188
  it.skip('should treat an ENAMETOOLONG as a 414', function(done) {
    const path = 'foobar'.repeat(11000)
    const server = createServer()

    request(server)
      .get(`/${path}/`)
      .expect(414, done)
  })

  it('should skip non-directories', function(done) {
    const server = createServer()

    request(server)
      .get('/nums/')
      .expect(404, 'Not Found', done)
  })

  describe('when given Accept: header', function() {
    describe('when Accept: application/json is given', function() {
      it('should respond with json', function(done) {
        const server = createServer()

        request(server)
          .get('/')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(/g# %3 o & %2525 %37 dir/)
          .expect(/users/)
          .expect(/file #1\.txt/)
          .expect(/nums/)
          .expect(/todo\.txt/)
          .expect(/さくら\.txt/)
          .expect(200, done)
      })

      it('should include security header', function(done) {
        const server = createServer()

        request(server)
          .get('/')
          .set('Accept', 'application/json')
          .expect('X-Content-Type-Options', 'nosniff')
          .expect(200, done)
      })
    })

    describe('when Accept: text/html is given', function() {
      it('should respond with html', function(done) {
        const server = createServer()

        request(server)
          .get('/')
          .set('Accept', 'text/html')
          .expect(200)
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(/<!DOCTYPE html>/)
          .expect(/<head>/)
          .expect(/<body>/)
          .expect(/<a href="g%23%20%253%20o%20%26%20%252525%20%2537%20dir\/"/)
          .expect(/<a href="users\/"/)
          .expect(/<a href="file%20%231.txt"/)
          .expect(/<a href="todo.txt"/)
          .expect(/<a href="%E3%81%95%E3%81%8F%E3%82%89\.txt"/)
          .end(done)
      })

      it('should include security header', function(done) {
        const server = createServer()

        request(server)
          .get('/')
          .set('Accept', 'text/html')
          .expect('X-Content-Type-Options', 'nosniff')
          .expect(200, done)
      })

      it('should property escape file names', function(done) {
        const server = createServer()

        request(server)
          .get('/')
          .set('Accept', 'text/html')
          .expect(200)
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(/<a href="foo%20%26%20bar"/)
          .expect(/foo &amp; bar/)
          .expect(bodyDoesNotContain('foo & bar'))
          .end(done)
      })

      it('should sort folders first', function(done) {
        const server = createServer(fixtures, customTemplate)

        request(server)
          .get('/')
          .set('Accept', 'text/html')
          .expect(200)
          .expect('Content-Type', 'text/html; charset=utf-8')
          .end(function(error, response) {
            if (error) {
              done(error)
            }
            const body = response.text.split('</h1>')[1]
            const urls = body.split(/<a href="([^"]*)"/).filter(function(s, i) {
              return i % 2
            })

            assert.deepEqual(urls, [
              '%23directory/',
              'collect/',
              'g%23%20%253%20o%20%26%20%252525%20%2537%20dir/',
              'users/',
              'file%20%231.txt',
              'foo%20%26%20bar',
              'nums',
              'todo.txt',
              '%E3%81%95%E3%81%8F%E3%82%89.txt',
            ])
            done()
          })
      })
    })

    describe('when Accept: text/plain is given', function() {
      it('should respond with text', function(done) {
        const server = createServer()

        request(server)
          .get('/')
          .set('Accept', 'text/plain')
          .expect(200)
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect(/users/)
          .expect(/g# %3 o & %2525 %37 dir/)
          .expect(/file #1.txt/)
          .expect(/todo.txt/)
          .expect(/さくら\.txt/)
          .end(done)
      })

      it('should include security header', function(done) {
        const server = createServer()

        request(server)
          .get('/')
          .set('Accept', 'text/plain')
          .expect('X-Content-Type-Options', 'nosniff')
          .expect(200, done)
      })
    })

    describe('when Accept: application/x-bogus is given', function() {
      it('should respond with 406', function(done) {
        const server = createServer()

        request(server)
          .get('/')
          .set('Accept', 'application/x-bogus')
          .expect(406, done)
      })
    })
  })

  describe('with "hidden" option', function() {
    it('should filter hidden files by default', function(done) {
      const server = createServer()

      request(server)
        .get('/')
        .expect(bodyDoesNotContain('.hidden'))
        .expect(200, done)
    })

    it('should filter hidden files', function(done) {
      const server = createServer('test/fixtures', {hidden: false})

      request(server)
        .get('/')
        .expect(bodyDoesNotContain('.hidden'))
        .expect(200, done)
    })

    it('should not filter hidden files', function(done) {
      const server = createServer('test/fixtures', {hidden: true})

      request(server)
        .get('/')
        .expect(200, /\.hidden/, done)
    })

    it('should filter hidden dirs by default', function(done) {
      const server = createServer()

      request(server)
        .get('/')
        .expect(bodyDoesNotContain('.hidden-dir'))
        .expect(200, done)
    })

    it('should filter hidden dirs', function(done) {
      const server = createServer('test/fixtures', {hidden: false})

      request(server)
        .get('/')
        .expect(bodyDoesNotContain('.hidden-dir'))
        .expect(200, done)
    })

    it('should not filter hidden dirs', function(done) {
      const server = createServer('test/fixtures', {hidden: true})

      request(server)
        .get('/')
        .expect(200, /\.hidden-dir/, done)
    })

    it('should deny hidden dir listing', function(done) {
      const server = createServer('test/fixtures', {hidden: false})

      request(server)
        .get('/.hidden-dir/')
        .expect(403, done)
    })

    it('should allow hidden dir listing', function(done) {
      const server = createServer('test/fixtures', {hidden: true})

      request(server)
        .get('/.hidden-dir/')
        .expect(200, /\.hidden-file/, done)
    })
  })

  describe('with "render" option', function() {
    describe('when setting a custom render file', function() {
      let server
      before(function() {
        server = createServer(fixtures, customTemplate)
      })

      it('should respond with file list', function(done) {
        request(server)
          .get('/')
          .set('Accept', 'text/html')
          .expect(/<a href="g%23%20%253%20o%20%26%20%252525%20%2537%20dir\/"/)
          .expect(/<a href="users\/"/)
          .expect(/<a href="file%20%231.txt"/)
          .expect(/<a href="todo.txt"/)
          .expect(200, done)
      })

      it('should respond with testing template sentence', function(done) {
        request(server)
          .get('/')
          .set('Accept', 'text/html')
          .expect(200, /This is the test template/, done)
      })

      it('should list directory twice', function(done) {
        request(server)
          .get('/users/')
          .set('Accept', 'text/html')
          .expect(function(response) {
            const occurances = response.text.match(/directory \/users\//g)
            if (occurances && occurances.length === 2) {
              return
            }
            throw new Error('directory not listed twice')
          })
          .expect(200, done)
      })
    })

    describe('when setting a custom render function', function() {
      it('should invoke function to render', function(done) {
        const server = createServer(fixtures, {
          process: [
            {
              accept: 'text/html',
              render() {
                return 'This is a template.'
              },
            },
          ],
        })

        request(server)
          .get('/')
          .set('Accept', 'text/html')
          .expect(200, 'This is a template.', done)
      })

      it('should handle render errors', function(done) {
        const server = createServer(fixtures, {
          process: [
            {
              accept: 'text/html',
              render() {
                throw new Error('boom!')
              },
            },
          ],
        })

        request(server)
          .get('/')
          .set('Accept', 'text/html')
          .expect(500, 'boom!', done)
      })

      it('should provide "pathname" local', function(done) {
        const server = createServer(fixtures, {
          process: [
            {
              accept: 'text/html',
              render(data) {
                return JSON.stringify(data.pathname)
              },
            },
          ],
        })

        request(server)
          .get('/users/')
          .set('Accept', 'text/html')
          .expect(200, '"/users/"', done)
      })

      it('should provide "files" local', function(done) {
        const server = createServer(fixtures, {
          process: [
            {
              accept: 'text/html',
              render(data) {
                return JSON.stringify(
                  data.files.map(function(file) {
                    return {
                      name: file.name,
                      stats: file instanceof fs.Stats,
                    }
                  })
                )
              },
            },
          ],
        })

        request(server)
          .get('/users/')
          .set('Accept', 'text/html')
          .expect(
            '[{"name":"#dir","stats":true},{"name":"index.html","stats":true},{"name":"tobi.txt","stats":true}]'
          )
          .expect(200, done)
      })

      it('should provide "path" local', function(done) {
        const server = createServer(fixtures, {
          process: [
            {
              accept: 'text/html',
              render(data) {
                return JSON.stringify(data.path)
              },
            },
          ],
        })

        request(server)
          .get('/users/')
          .set('Accept', 'text/html')
          .expect(200, JSON.stringify(path.join(fixtures, 'users/')), done)
      })
    })

    describe('when setting a custom template to "false"', function() {
      it('should respond with 406', function(done) {
        const server = createServer(fixtures, {
          process: [
            {
              accept: 'text/html',
              render: false,
            },
          ],
        })

        request(server)
          .get('/')
          .set('Accept', 'text/html')
          .expect(406, done)
      })
    })
  })

  describe('when navigating to other directory', function() {
    it('should respond with correct listing', function(done) {
      const server = createServer()

      request(server)
        .get('/users/')
        .set('Accept', 'text/html')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<a href="index.html"/)
        .expect(/<a href="tobi.txt"/)
        .end(done)
    })

    it('should work for directory with #', function(done) {
      const server = createServer()

      request(server)
        .get('/%23directory/')
        .set('Accept', 'text/html')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<a href="index.html"/)
        .end(done)
    })

    it('should work for directory with special chars', function(done) {
      const server = createServer()

      request(server)
        .get('/g%23%20%253%20o%20%26%20%252525%20%2537%20dir/')
        .set('Accept', 'text/html')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<a href="empty.txt"/)
        .end(done)
    })

    it('should property escape directory names', function(done) {
      const server = createServer()

      request(server)
        .get('/g%23%20%253%20o%20%26%20%252525%20%2537%20dir/')
        .set('Accept', 'text/html')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/g# %3 o &amp; %2525 %37 dir/)
        .expect(bodyDoesNotContain('g# %3 o & %2525 %37 dir'))
        .end(done)
    })

    it('should not work for outside root', function(done) {
      const server = createServer()

      request(server)
        .get('/../support/')
        .set('Accept', 'text/html')
        .expect(403, done)
    })
  })

  describe('when set with trailing slash', function() {
    let server
    before(function() {
      server = createServer(`${fixtures}/`)
    })

    it('should respond with file list', function(done) {
      request(server)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(/users/)
        .expect(/file #1\.txt/)
        .expect(/nums/)
        .expect(/todo\.txt/)
        .expect(200, done)
    })
  })
  ;(skipRelative ? describe.skip : describe)("when set to '.'", function() {
    let server
    before(function() {
      server = createServer('.')
    })

    it('should respond with file list', function(done) {
      const destination = relative.split(path.sep).join('/')
      request(server)
        .get(`/${destination}/`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(/users/)
        .expect(/file #1\.txt/)
        .expect(/nums/)
        .expect(/todo\.txt/)
        .expect(200, done)
    })

    it('should not allow serving outside root', function(done) {
      request(server)
        .get('/../')
        .set('Accept', 'text/html')
        .expect(403, done)
    })
  })
})

function alterProperty(object, property, value) {
  let previous

  beforeEach(function() {
    previous = object[property]
    object[property] = value
  })

  afterEach(function() {
    object[property] = previous
  })
}

function createServer(directory, options) {
  directory = directory || fixtures

  const sd = serveDirectory(directory, options)

  return http.createServer(function(request, response) {
    sd(request, response, function(error) {
      response.statusCode = error ? error.status || 500 : 404
      response.end(error ? error.message : 'Not Found')
    })
  })
}

function bodyDoesNotContain(text) {
  return function(response) {
    assert.equal(response.text.indexOf(text), -1)
  }
}
