import isURLBase from './isURLBase.ts';

/**
 * Determine whether a value is a [`URL`](https://mdn.io/URL) instance.
 * Works cross-realm/iframe and despite `Symbol.toStringTag`.
 */
export default (url: unknown) => isURLBase(url);
