import isURLBase from './isURLBase.ts';

/**
 * Leniently determine whether a value is a [`URL`](https://mdn.io/URL) instance.
 * Works cross-realm/iframe and despite `Symbol.toStringTag`.
 */
export default (url: unknown) => isURLBase(url, true);
