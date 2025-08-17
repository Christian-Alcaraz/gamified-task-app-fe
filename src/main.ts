import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { appConfig } from './app/app.component.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
