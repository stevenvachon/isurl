# isurl [![NPM Version][npm-image]][npm-url] ![Build Status][ghactions-image] [![Coverage Status][codecov-image]][codecov-url]

> Determine whether a value is a [`URL`](https://mdn.io/URL).


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

Optionally, acceptance can be extended to incomplete `URL` implementations that lack `origin`, `searchParams` and `toJSON` properties (which is common with web browsers from 2021):
```js
const url = new URL('http://domain/?query');

console.log(url.searchParams);  //-> undefined

isURL.lenient(url);  //-> true
```


[npm-image]: https://img.shields.io/npm/v/isurl
[npm-url]: https://npmjs.com/isurl
[ghactions-image]: https://img.shields.io/github/actions/workflow/status/stevenvachon/isurl/test.yml?branch=4.x.x
[codecov-image]: https://img.shields.io/codecov/c/github/stevenvachon/isurl/4.x.x
[codecov-url]: https://app.codecov.io/github/stevenvachon/isurl/tree/4.x.x
