// In single-spa, the assets need to be loaded from a dynamic location,
// instead of hard coded to `/assets`. We use webpack public path for this.
// See https://webpack.js.org/guides/public-path/#root

import { environment } from "@kore.environment";

declare var  __webpack_public_path__: string;


export function assetUrl(url: string): string {
  
  if (environment.tag !== 'dev') {
    environment.API_SERVER_URL = window.location.protocol + '//' + window.location.host;
    __webpack_public_path__ = window.location.protocol + '//' + window.location.host + '/koreagentassist/';
  } else {
    __webpack_public_path__ = 'http://localhost:4200/';
  }

  // @ts-ignore
  const publicPath = __webpack_public_path__;
  const publicPathSuffix = publicPath.endsWith('/') ? '' : '/';
  const urlPrefix = url.startsWith('/') ? '' : '/';
  let assets =  'assets'
  return `${publicPath}${publicPathSuffix}${assets}${urlPrefix}${url}`;
}
