# isurl [![NPM Version][npm-image]][npm-url] ![File Size][filesize-image] ![Build Status][ghactions-image] [![Coverage Status][codecov-image]][codecov-url]

> Determine whether a value is a [`URL`](https://mdn.io/URL) instance.

Works cross-realm/iframe and despite `Symbol.toStringTag`.

> [!NOTE]
>
> If you need to support older versions of Node.js (going back to `8.x`), use `4.x` of this package.

## Install

```shell
npm install isurl
```

## Usage

### Strict

The standard.

```js
import isURL from 'isurl';

isURL('http://domain/'); //-> false
isURL(new URL('http://domain/')); //-> true
```

### Lenient

Acceptance can be extended to incomplete `URL` implementations that lack `origin`, `searchParams` and `toJSON` properties (which is common with web browsers from 2021):

```js
import isURL from 'isurl/lenient';

console.log(url.searchParams); //-> undefined

isURL(url); //-> true
```

[npm-image]: https://img.shields.io/npm/v/isurl
[npm-url]: https://npmjs.com/package/isurl
[filesize-image]: https://img.shields.io/badge/bundle-865B%20gzipped-blue.svg
[ghactions-image]: https://img.shields.io/github/actions/workflow/status/stevenvachon/isurl/test.yml
[codecov-image]: https://img.shields.io/codecov/c/github/stevenvachon/isurl
[codecov-url]: https://app.codecov.io/github/stevenvachon/isurl
