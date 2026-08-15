import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import customizeSymbol from 'incomplete-symbol';
import customizeURL from 'incomplete-url';
import { LENIENT_PROPERTIES, STRICT_PROPERTIES } from './isURLBase.ts';
import { parse as parseURL } from 'node:url';
import { URL as ShimmedURL } from 'whatwg-url';

const URL_PROPERTIES = [...LENIENT_PROPERTIES, ...STRICT_PROPERTIES] as const;
const URL_STRING = 'http://hostname?param=value';

let isURL: typeof import('./isURL.ts').default;
let isURLLenient: typeof import('./isURLLenient.ts').default;

const createMock = ({
  omitKey,
  toStringTag,
}: {
  /**
   * Optionally omit a key/value pair (for a property or method) from the mock.
   * @example 'has'
   */
  omitKey?: string;
  /**
   * When `true`, the mock will have a correct `@@toStringTag`.
   */
  toStringTag?: boolean;
} = {}) => {
  const mock = {
    hash: '',
    host: 'hostname',
    hostname: 'hostname',
    href: URL_STRING,
    origin: URL_STRING,
    password: '',
    pathname: '/',
    port: '',
    protocol: 'http:',
    search: '?param=value',
    searchParams: {
      append: () => {},
      delete: () => {},
      entries: () => {},
      get: () => {},
      getAll: () => {},
      has: () => {},
      keys: () => {},
      set: () => {},
      sort: () => {},
      values: () => {},
    },
    toJSON: () => {},
    username: '',
  };

  if (omitKey) {
    if ((URL_PROPERTIES as readonly string[]).includes(omitKey)) {
      Reflect.deleteProperty(mock, omitKey);
    } else if (mock.searchParams) {
      Reflect.deleteProperty(mock.searchParams, omitKey);
    }
  }

  if (toStringTag) {
    Object.assign(mock, { [Symbol.toStringTag]: 'URL' });

    if (mock.searchParams) {
      Object.assign(mock.searchParams, { [Symbol.toStringTag]: 'URLSearchParams' });
    }
  }

  return mock;
};

const importFresh = async () => {
  vi.resetModules();
  ({ default: isURL } = await import('./isURL.ts'));
  ({ default: isURLLenient } = await import('./isURLLenient.ts'));
};

beforeAll(() => importFresh());

it('accepts a native full implementation', () => {
  const url = new URL(URL_STRING);
  expect(isURL(url)).toBe(true);
  expect(isURLLenient(url)).toBe(true);
});

it('accepts a shimmed full implementation', () => {
  const url = new ShimmedURL(URL_STRING);
  expect(isURL(url)).toBe(true);
  expect(isURLLenient(url)).toBe(true);
});

it('can accept a partial implementation', () => {
  const { IncompleteURL } = customizeURL({ urlExclusions: ['searchParams'] });
  const url = new IncompleteURL(URL_STRING);
  expect(isURL(url)).toBe(false);
  expect(isURLLenient(url)).toBe(true);
});

it('can accept a partial URLSearchParams implementation', () => {
  const { IncompleteURL } = customizeURL({ paramsExclusions: ['sort'] });
  const url = new IncompleteURL(URL_STRING);
  expect(isURL(url)).toBe(false);
  expect(isURLLenient(url)).toBe(true);
});

it('rejects non-URL types', () =>
  [
    URL_STRING,
    createMock(),
    parseURL(URL_STRING),
    parseURL(URL_STRING, true),
    Symbol(URL_STRING),
    {},
    [],
    /regex/,
    true,
    1,
    1n,
    null,
    undefined,
  ].forEach(fixture => {
    expect(isURL(fixture)).toBe(false);
    expect(isURLLenient(fixture)).toBe(false);
  }));

URL_PROPERTIES.forEach(key =>
  it(`rejects a mocked implementation lacking the "${key}" property`, () => {
    const mock = createMock({ omitKey: key, toStringTag: true });

    expect(isURL(mock)).toBe(false);

    if ((LENIENT_PROPERTIES as readonly string[]).includes(key)) {
      expect(isURLLenient(mock)).toBe(true);
    } else {
      expect(isURLLenient(mock)).toBe(false);
    }
  })
);

it('rejects a mocked implementation lacking the "sort" property', () => {
  const mock = createMock({ omitKey: 'sort', toStringTag: true });
  expect(isURL(mock)).toBe(false);
  expect(isURLLenient(mock)).toBe(true);
});

describe('Environments lacking @@toStringTag', () => {
  const OriginalSymbol = Symbol;

  beforeEach(async () => {
    globalThis.Symbol = customizeSymbol(['toStringTag']) as unknown as SymbolConstructor;
    await importFresh();
  });

  afterAll(async () => {
    globalThis.Symbol = OriginalSymbol;
    await importFresh();
  });

  it('accepts a mocked full implementation with incorrect constructor name', () => {
    const mock = createMock();
    expect(isURL(mock)).toBe(true);
    expect(isURLLenient(mock)).toBe(true);
  });
});

describe('Weaknesses', () => {
  it('accepts a mocked full implementation that uses @@toStringTag', () => {
    const mock = createMock({ toStringTag: true });
    expect(isURL(mock)).toBe(true);
  });

  it('can leniently accept a mocked partial implementation that uses @@toStringTag', () => {
    const noSearchParams = createMock({ omitKey: 'searchParams', toStringTag: true });
    const noSort = createMock({ omitKey: 'sort', toStringTag: true });
    expect(isURLLenient(noSearchParams)).toBe(true);
    expect(isURLLenient(noSort)).toBe(true);
  });
});
