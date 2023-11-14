// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  tag:"qa",
  API_SERVER_URL:'https://qa-bots.kore.ai',
  USE_SESSION_STORE:false,
  ON_PREMISE: false,
  SUPPORT_API_SERVER_URL:'https://uat-smartassist.kore.ai',
  BOT_NAME: "Kore Support",
  BOT_ID: "st-dfac6407-04dc-50a1-8b4f-51f22f615b5a",
  CLIENT_ID: "cs-158e5c08-98d9-5a6f-a799-84a0bf260a58",
  CLIENT_SECRET_ID: "vvAxkeF1Hu1SPDtF8iplkv6eqScRejbeI89ppNf7ujM=",
  INLINE_MANUAL_SITE_KEY: "8c0da373990588f43a6e20d8d22228ee"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.