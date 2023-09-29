import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (environment && environment.hasOwnProperty('MIX_PANEL_TOKEN')) {
  const env: any = environment;
  if (env.hasOwnProperty('ENABLE_MIX_PANEL')) {
    // if (env['ENABLE_MIX_PANEL']) {
    //   mixpanel.init(env['MIX_PANEL_TOKEN'], { batch_requests: true, ignore_dnt: true });
    // }
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
