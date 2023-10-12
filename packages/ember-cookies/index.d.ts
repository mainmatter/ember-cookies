type Options = {
  maxAge?: number | string;
  domain?: string;
  expires?: Date;
  secure?: boolean;
  httpOnly?: boolean;
  path?: string;
  sameSite?: string;
}

declare module 'ember-cookies/test-support' {
  export default function clearAllCookies(param?: Options): void
}