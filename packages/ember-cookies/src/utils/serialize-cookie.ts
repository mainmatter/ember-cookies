import { typeOf, isEmpty } from '@ember/utils';

interface Options {
  maxAge?: number | string;
  domain?: string;
  expires?: Date;
  secure?: boolean;
  httpOnly?: boolean;
  path?: string;
  sameSite?: string;
  partitioned?: boolean;
}

export const serializeCookie = (name: string, value: string, options: Options = {}) => {
  let cookie = `${name}=${value}`;

  if (!isEmpty(options.domain)) {
    cookie = `${cookie}; domain=${options.domain}`;
  }
  if (options.expires && typeOf(options.expires) === 'date') {
    cookie = `${cookie}; expires=${options.expires.toUTCString()}`;
  }
  if (!isEmpty(options.maxAge)) {
    cookie = `${cookie}; max-age=${options.maxAge}`;
  }
  if (options.secure) {
    cookie = `${cookie}; secure`;
  }
  if (options.httpOnly) {
    cookie = `${cookie}; httpOnly`;
  }
  if (!isEmpty(options.path)) {
    cookie = `${cookie}; path=${options.path}`;
  }
  if (!isEmpty(options.sameSite)) {
    cookie = `${cookie}; SameSite=${options.sameSite}`;
  }
  if (options.partitioned) {
    cookie = `${cookie}; Partitioned`;
  }

  return cookie;
};
