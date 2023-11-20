import { enableProdMode, NgZone } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router, NavigationStart } from '@angular/router';
import { ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser';

import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';

/// @ts-ignore
require('./app/scss/styles.scss?ngGlobalStyle')

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { assetUrl } from './single-spa/asset-url';

declare const window;

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    window.isUnifiedPlatform = true;
    singleSpaPropsSubject.next(singleSpaProps);
    return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
  },
  template: '<app-agentassist-root />',
  Router,
  NavigationStart,
  NgZone,
  AnimationEngine,
});

// main.single-spa.ts
function loadLinks(url: string) {
  return new Promise((resolve:any, reject) => {
    const links:any = document.createElement('link');
    links.href = url;
    links.rel="stylesheet";

    document.head.appendChild(links);
    resolve();
  });
};

// Modify the bootstrap function like so
export const bootstrap = [
  () =>
    Promise.all([
      loadLinks(
        assetUrl('agentassist-icons/style.css'),
      ),
      // loadLinks( assetUrl('fonts/inter/Inter-SemiBold.woff2?v=3.13')),
      // loadLinks( assetUrl('fonts/inter/Inter-Medium.woff2?v=3.13')),
      // loadLinks( assetUrl('fonts/inter/Inter-Bold.woff2?v=3.13')),
      // loadLinks( assetUrl('fonts/inter/Inter-Regular.woff2?v=3.13'))


    ]),
  lifecycles.bootstrap,
];

// export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
