import { isNone, isPresent, isEmpty } from '@ember/utils';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import Service from '@ember/service';
import { serializeCookie } from '../utils/serialize-cookie.ts';

const DEFAULTS = { raw: false };
const MAX_COOKIE_BYTE_LENGTH = 4096;

type ReadOptions = {
  raw?: boolean;
  domain?: never;
  expires?: never;
  maxAge?: never;
  path?: never;
};

type WriteOptions = {
  domain?: string;
  path?: string;
  secure?: boolean;
  raw?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  signed?: never;
  httpOnly?: boolean;
} & ({ expires?: Date; maxAge?: never } | { maxAge?: number; expires?: never });

type ClearOptions = {
  domain?: string;
  path?: string;
  secure?: boolean;

  expires?: never;
  maxAge?: never;
  raw?: never;
};

type CookiePair = [string, string];

type FastbootCookies = Record<string, { value?: string; options?: any }>;

export default class CookiesService extends Service {
  _fastBoot:
    | any
    | {
        request?: {
          cookies?: Record<string, string>;
        };
      };
  _fastBootCookiesCache?: FastbootCookies;

  protected _document: Document = window.document;

  constructor() {
    super(...arguments);

    let owner = getOwner(this);
    if (typeof this._fastBoot === 'undefined' && owner) {
      this._fastBoot = owner.lookup('service:fastboot');
    }
  }

  _getDocumentCookies() {
    let all = this._document.cookie.split(';');
    let filtered = this._filterDocumentCookies(all);

    return filtered.reduce(
      (acc, cookie) => {
        if (!isEmpty(cookie)) {
          let [key, value] = cookie;
          acc[key.trim()] = (value || '').trim();
        }
        return acc;
      },
      {} as Record<string, string>
    );
  }

  _getFastBootCookies() {
    const fastBootCookies = Object.keys(this._fastBoot.request.cookies).reduce((acc, name) => {
      const value = fastBootCookies[name];

      if (typeof value === 'object') {
        acc[name] = value;
      } else {
        acc[name] = { value };
      }

      return acc;
    }, {} as FastbootCookies);
    const fastBootCookiesCache = this._fastBootCookiesCache || {};

    const mergedFastBootCookies = Object.assign({}, fastBootCookies, fastBootCookiesCache);
    this._fastBootCookiesCache = mergedFastBootCookies;
    return this._filterCachedFastBootCookies(mergedFastBootCookies);
  }

  read(
    name?: string,
    options: ReadOptions = {}
  ): string | undefined | Record<string, string | undefined> {
    options = Object.assign({}, DEFAULTS, options || {});
    assert(
      'Domain, Expires, Max-Age, and Path options cannot be set when reading cookies',
      isEmpty(options.domain) &&
        isEmpty(options.expires) &&
        isEmpty(options.maxAge) &&
        isEmpty(options.path)
    );

    let all: Record<string, string | undefined> = {};
    if (this._isFastBoot()) {
      all = this._getFastBootCookies();
    } else {
      all = this._getDocumentCookies();
    }

    if (name) {
      return this._decodeValue(all[name], options.raw);
    } else {
      Object.keys(all).forEach(name => (all[name] = this._decodeValue(all[name], options.raw)));
      return all;
    }
  }

  write(name: string, value: unknown, options?: WriteOptions) {
    options = Object.assign({}, DEFAULTS, options || {});
    assert(
      "Cookies cannot be set as signed as signed cookies would not be modifyable in the browser as it has no knowledge of the express server's signing key!",
      !options.signed
    );
    assert(
      'Cookies cannot be set with both maxAge and an explicit expiration time!',
      isEmpty(options.expires) || isEmpty(options.maxAge)
    );

    value = this._encodeValue(value as string, options.raw);

    assert(
      `Cookies larger than ${MAX_COOKIE_BYTE_LENGTH} bytes are not supported by most browsers!`,
      typeof value === 'string' && this._isCookieSizeAcceptable(value)
    );

    if (this._isFastBoot()) {
      this._writeFastBootCookie(name, value, options);
    } else {
      assert('Cookies cannot be set to be HTTP-only from a browser!', !options.httpOnly);

      options.path = options.path || this._normalizedDefaultPath();
      this._writeDocumentCookie(name, value, options);
    }
  }

  clear(name: string, options?: ClearOptions) {
    options = Object.assign({}, options || {});
    assert(
      'Expires, Max-Age, and raw options cannot be set when clearing cookies',
      isEmpty(options.expires) && isEmpty(options.maxAge) && isEmpty(options.raw)
    );

    options.expires = new Date('1970-01-01') as never;
    options.path = options.path || this._normalizedDefaultPath();
    this.write(name, null, options);
  }

  exists(name: string) {
    let all;
    if (this._isFastBoot()) {
      all = this._getFastBootCookies();
    } else {
      all = this._getDocumentCookies();
    }

    return Object.prototype.hasOwnProperty.call(all, name);
  }

  _writeDocumentCookie(name: string, value: unknown, options: WriteOptions = {}) {
    let serializedCookie = this._serializeCookie(name, value, options);
    this._document.cookie = serializedCookie;
  }

  _writeFastBootCookie(name: string, value: unknown, options: WriteOptions = {}) {
    let responseHeaders = this._fastBoot.response.headers;
    let serializedCookie = this._serializeCookie(name, value, options);

    if (options.maxAge) {
      options.maxAge *= 1000;
    }

    this._cacheFastBootCookie(name, value, options);

    let replaced = false;
    let existing = responseHeaders.getAll('set-cookie');

    for (let i = 0; i < existing.length; i++) {
      if (existing[i].startsWith(`${name}=`)) {
        existing[i] = serializedCookie;
        replaced = true;
        break;
      }
    }

    if (!replaced) {
      responseHeaders.append('set-cookie', serializedCookie);
    }
  }

  _cacheFastBootCookie(name: string, value: unknown, options: WriteOptions = {}) {
    let fastBootCache = this._fastBootCookiesCache || {};
    let cachedOptions: WriteOptions = Object.assign({}, options);

    if (cachedOptions.maxAge && options.maxAge) {
      let expires = new Date();
      expires.setSeconds(expires.getSeconds() + options.maxAge);

      delete cachedOptions.maxAge;
      (cachedOptions as WriteOptions & { expires?: Date; maxAge?: never }).expires = expires;
    }

    fastBootCache[name] = { value: value as string, options: cachedOptions };
    this._fastBootCookiesCache = fastBootCache;
  }

  _filterCachedFastBootCookies(fastBootCookies: FastbootCookies) {
    let { path: requestPath } = this._fastBoot.request;

    let host = this._fastBoot?.request?.host;

    return Object.keys(fastBootCookies).reduce(
      (acc, name) => {
        let { value, options } = fastBootCookies[name] as { value: string; options: ReadOptions };
        options = options || {};

        let { path: optionsPath, domain, expires } = options;

        if (optionsPath && requestPath.indexOf(optionsPath) !== 0) {
          return acc;
        }

        if (domain && host.indexOf(domain) + (domain as string).length !== host.length) {
          return acc;
        }

        if (expires && (expires as Date) < new Date()) {
          return acc;
        }

        acc[name] = value;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  _encodeValue(value: string | undefined, raw?: boolean) {
    if (isNone(value)) {
      return '';
    } else if (raw) {
      return value;
    } else {
      return encodeURIComponent(value);
    }
  }

  _decodeValue(value: string | undefined, raw?: boolean) {
    if (isNone(value) || raw) {
      return value;
    } else {
      return decodeURIComponent(value);
    }
  }

  _filterDocumentCookies(unfilteredCookies: string[]): CookiePair[] {
    return unfilteredCookies
      .map<CookiePair>(c => {
        let separatorIndex = c.indexOf('=');
        return [c.substring(0, separatorIndex), c.substring(separatorIndex + 1)];
      })
      .filter(c => c.length === 2 && isPresent(c[0]));
  }

  _serializeCookie(name: string, value: unknown, options: WriteOptions = {}) {
    return serializeCookie(name, value, options);
  }

  _isCookieSizeAcceptable(value: string) {
    // Counting bytes varies Pre-ES6 and in ES6
    // This snippet counts the bytes in the value
    // about to be stored as the cookie:
    // See https://stackoverflow.com/a/25994411/6657064
    let _byteCount = 0;
    let i = 0;
    let c;
    while ((c = value.charCodeAt(i++))) {
      _byteCount += c >> 11 ? 3 : c >> 7 ? 2 : 1;
    }

    return _byteCount < MAX_COOKIE_BYTE_LENGTH;
  }

  _normalizedDefaultPath() {
    if (!this._isFastBoot()) {
      let pathname = window.location.pathname;
      return pathname.substring(0, pathname.lastIndexOf('/'));
    }
  }

  _isFastBoot() {
    return this._fastBoot && this._fastBoot.isFastBoot;
  }
}
