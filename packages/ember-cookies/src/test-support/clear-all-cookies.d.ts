type Options = {
    maxAge?: number | string;
    domain?: string;
    expires?: Date;
    secure?: boolean;
    httpOnly?: boolean;
    path?: string;
    sameSite?: string;
}
  
export function clearAllCookies(param?: Options): void
  