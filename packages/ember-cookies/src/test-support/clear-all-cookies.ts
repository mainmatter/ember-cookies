import { assert } from '@ember/debug';
import { isEmpty } from '@ember/utils';
import { serializeCookie } from '../utils/serialize-cookie.ts';
import type { WriteOptions } from '../services/cookies.ts';

export default function clearAllCookies(options: WriteOptions = {}) {
  assert('Cookies cannot be set to be HTTP-only from a browser!', !options.httpOnly);
  assert(
    'Expires, Max-Age, and raw options cannot be set when clearing cookies',
    isEmpty(options.expires) && isEmpty(options.maxAge) && isEmpty(options.raw)
  );
  options = Object.assign({}, options, {
    expires: new Date(0),
  });

  let cookies = document.cookie.split(';');

  cookies.forEach(cookie => {
    let cookieName = cookie.split('=')[0];

    if (typeof cookieName === 'string') {
      document.cookie = serializeCookie(cookieName, '', options);
    }
  });
}
