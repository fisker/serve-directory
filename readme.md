# serve-directory

[![Build Status](https://img.shields.io/travis/fisker/serve-directory/master.svg?style=flat-square)](https://travis-ci.org/fisker/serve-directory)
[![devDependencies](https://img.shields.io/david/dev/fisker/serve-directory.svg?style=flat-square)](https://david-dm.org/fisker/serve-directory)
[![Coveralls github](https://img.shields.io/coveralls/github/fisker/serve-directory.svg?style=flat-square)](https://coveralls.io/github/fisker/serve-directory)
[![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/g/fisker/serve-directory.svg?style=flat-square)](https://lgtm.com/projects/g/fisker/serve-directory)
[![Issues](http://img.shields.io/github/issues/fisker/serve-directory.svg?style=flat-square)](https://github.com/fisker/serve-directory/issues)
[![Issues](https://img.shields.io/github/issues-pr/fisker/serve-directory.svg?style=flat-square)](https://github.com/fisker/serve-directory/pulls)
[![GitHub last commit](https://img.shields.io/github/last-commit/fisker/serve-directory.svg?style=flat-square)](https://github.com/fisker/serve-directory/commits)
[![GitHub Release Date](https://img.shields.io/github/release-date/fisker/serve-directory.svg?style=flat-square)](https://github.com/fisker/serve-directory/releases)

[![npm](https://img.shields.io/npm/v/serve-directory.svg?style=flat-square)](https://www.npmjs.com/package/serve-directory)
[![npm](https://img.shields.io/npm/dt/serve-directory.svg?style=flat-square)](https://www.npmjs.com/package/serve-directory)
[![dependencies](https://img.shields.io/david/fisker/serve-directory.svg?style=flat-square)](https://david-dm.org/fisker/serve-directory)
[![Snyk Vulnerabilities for npm package version](https://img.shields.io/snyk/vulnerabilities/npm/serve-directory.svg?style=flat-square)](https://snyk.io/vuln/npm:serve-directory)
[![install size](https://packagephobia.now.sh/badge?p=serve-directory&style=flat-square)](https://packagephobia.now.sh/result?p=serve-directory)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![MIT license](https://img.shields.io/github/license/fisker/serve-directory.svg?style=flat-square)](http://opensource.org/licenses/MIT)

> Serves pages that contain directory listings for a given path. forked from expressjs/serve-directory

## Install

```sh
npm install serve-directory
```

## ustage

```js
const serveDirectory = require('serve-directory')

const directory = serveDirectory('wwwroot', options)
```

### Serve directory indexes with vanilla node.js http server

see [example.js](https://github.com/fisker/serve-directory/tree/master/example.js)

### serveDirectory(path, options)

Returns [middleware](https://expressjs.com/en/guide/using-middleware.html) that serves an index of the directory in the given `path`.

The `path` is based off the `req.url` value, so a `req.url` of `'/some/dir`
with a `path` of `'public'` will look at `'public/some/dir'`. If you are using
something like `express`, you can change the URL "base" with `app.use` (see
the express example).

### options(`Object`)

serveDirectory accepts these properties in the options object.

### example

[defaults](https://github.com/fisker/serve-directory/blob/master/src/defaults.js)

```js
{
  imports: {},
  hidden: false,
  relative: true,
  process: [
    {
      accept: 'text/html',
      render: 'lib/directory.jst'
    },
    {
      accept: 'text/plain',
      render: ({fileNames}) => fileNames.join(EOL) + EOL,
    },
    {
      accept: 'application/json',
      render: ({fileNames}) => JSON.stringify(fileNames),
    },
  ]
}
```

### options.imports(`Object`)

An object to import into the template as free variables., see [lodash.template](https://lodash.com/docs/4.17.4#template)

by default some useful functions will import automatically

see [utils/index.js](https://github.com/fisker/serve-directory/blob/master/src/utils/index.js)

### options.hidden(`Boolean`)

Show hidden files(file/folder start with `.`) , defaults to `false`.

### options.relative(`Object`)

Use relative url , default `true`.

### options.process(`Array`)

Array list how data should be handled

#### options.accept

`Array` or `String` split with `,`

space will be trim

### options.render

by default we use a compiled `lodash.template` function to render data

see [lodash.template](https://lodash.com/docs/4.17.4#template)

- `String`

  a path to a template file
  a template string

- `Function`

  a custom render function

- `falsy` value

  remove default render function

### data

`data` pass to the render function

- path `String`

  physical path

- pathname `String`

  decoded request pathname

- url `URL`

  request URL object

- method `String`

  request method

- responseType `String`

  response mine-type / content-type

- directory `fs.Stats`

  directory stats with additional info `path` `pathname` `url`

- files `Array<fs.Stats>`

  directory files stats with additional info `name` `ext` `type` `url`

- fileNames `Array<String>`

  directory files but `name` only

## License

MIT © [fisker Cheung](https://github.com/fisker)
