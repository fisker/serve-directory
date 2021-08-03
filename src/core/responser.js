import {CHARSET} from '../constants.js'

function responser(mime, render) {
  return (request, response, data) => {
    const body = render(data)

    // security header for content sniffing
    response.setHeader('X-Content-Type-Options', 'nosniff')

    // standard headers
    response.setHeader('Content-Type', `${mime}; charset=${CHARSET}`)
    response.setHeader('Content-Length', Buffer.byteLength(body, CHARSET))

    // body
    response.end(body, CHARSET)
  }
}

export default responser
