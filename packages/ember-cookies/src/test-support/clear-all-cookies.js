import { assert } from '@ember/debug';
import emberAssign from 'ember-cookies/utils/assign';
import { isEmpty } from '@ember/utils';
import { serializeCookie } from '../utils/serialize-cookie';

const assign = Object.assign || emberAssign;

export default function clearAllCookies(options = {}) {
  assert('Cookies cannot be set to be HTTP-only from a browser!', !options.httpOnly);
  assert(
    'Expires, Max-Age, and raw options cannot be set when clearing cookies',
    isEmpty(options.expires) && isEmpty(options.maxAge) && isEmpty(options.raw)
  );
  options = assign({}, options, {
    expires: new Date(0),
  });

  let cookies = document.cookie.split(';');

  cookies.forEach(cookie => {
    let cookieName = cookie.split('=')[0];
    document.cookie = serializeCookie(cookieName, '', options);
  });
}
