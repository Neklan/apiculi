# Apiculi

Generator for RESTfull API with CRUD operations.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![NPM License][license-image]][license-url]

## Installation

```sh
$ npm install -g apiculi
```

## Quick Start

The quickest way to get started with apiculi is to utilize the executable `apiculi` to generate an application as shown below:

Create the app:

```bash
$ apiculi my-app && cd my-app
```

Install dependencies:

```bash
$ npm install
```

Rock and Roll

```bash
$ npm start
```

## Command Line Options

This generator can also be further configured with the following command line flags.

    -h, --help         output usage information
    -V, --version      output the version number
        --git          add .gitignore
    -f, --force        force on non-empty directory
    -m, --mongo <url>  set mongo connection url
    -r, --redis <url>  set redis connection url

## License

[MIT](http://opensource.org/licenses/MIT)

[npm-image]: https://img.shields.io/npm/v/apiculi.svg
[npm-url]: https://npmjs.org/package/apiculi
[downloads-image]: https://img.shields.io/npm/dm/apiculi.svg
[downloads-url]: https://npmjs.org/package/apiculi
[license-image]: https://img.shields.io/npm/l/apiculi.svg
[license-url]: https://npmjs.org/package/apiculi