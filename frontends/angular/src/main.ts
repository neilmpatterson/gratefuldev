import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import 'zone.js'
import { AppComponent } from './app/app.component'
import { routes } from './app/app.routes'

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
}).catch(console.error)
