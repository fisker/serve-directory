import Directory from './core/directory.js'

function middleware(root, options) {
  const sd = new Directory(root, options)

  return sd.middleware.bind(sd)
}

export default middleware
