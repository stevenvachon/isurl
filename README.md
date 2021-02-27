# isurl [![NPM Version][npm-image]][npm-url] ![File Size][filesize-image] [![Build Status][travis-image]][travis-url] [![Dependency Monitor][greenkeeper-image]][greenkeeper-url]

> Determines whether a value is a WHATWG [`URL`](https://mdn.io/URL).


Works cross-realm/iframe and despite `Symbol.toStringTag`.


## Installation

[Node.js](https://nodejs.org) `>= 8` is required. To install, type this at the command line:
```shell
npm install isurl
```


## Usage

```js
const isURL = require('isurl');

isURL('http://domain/');  //-> false
isURL(new URL('http://domain/'));  //-> true
```

Optionally, acceptance can be extended to incomplete `URL` implementations that lack `origin`, `searchParams` and `toJSON` properties (which are common in many modern web browsers):
```js
const url = new URL('http://domain/?query');

console.log(url.searchParams);  //-> undefined

isURL.lenient(url);  //-> true
```


[npm-image]: https://img.shields.io/npm/v/isurl.svg
[npm-url]: https://npmjs.com/package/isurl
[filesize-image]: https://img.shields.io/badge/bundle-3.1kB%20gzipped-blue.svg
[travis-image]: https://img.shields.io/travis/stevenvachon/isurl.svg
[travis-url]: https://travis-ci.org/stevenvachon/isurl
[greenkeeper-image]: https://badges.greenkeeper.io/stevenvachon/isurl.svg
[greenkeeper-url]: https://greenkeeper.io/
