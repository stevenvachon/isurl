import hasToStringTag from 'has-tostringtag';
import isObject from 'is-object';
import isURLSearchParams from 'is-urlsearchparams';
import isURLSearchParamsLenient from 'is-urlsearchparams/lenient';

export const LENIENT_PROPERTIES = ['origin', 'searchParams', 'toJSON'] as const;

export const STRICT_PROPERTIES = [
  'hash',
  'host',
  'hostname',
  'href',
  'password',
  'pathname',
  'port',
  'protocol',
  'search',
  // 'toString' excluded because `Object::toString` exists
  'username',
] as const;

export default (url: unknown, supportIncomplete = false): url is URL => {
  if (!isObject(url)) {
    return false;
  }

  if (hasToStringTag() && Object.prototype.toString.call(url) !== '[object URL]') {
    // Shimmed implementation with incorrect constructor name
    return false;
  }

  if (!STRICT_PROPERTIES.every(prop => prop in url)) {
    return false;
  }

  if (supportIncomplete && 'searchParams' in url) {
    return isURLSearchParamsLenient((url as { searchParams: unknown }).searchParams);
  }

  if (supportIncomplete) {
    return true;
  }

  if (LENIENT_PROPERTIES.every(prop => prop in url)) {
    return isURLSearchParams((url as { searchParams: unknown }).searchParams);
  }

  return false;
};
