import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
//import { AboutPage } from '../pages/about/about';
import { Api, ResponseMessage } from '../providers';
import { MyApp } from './app.component';
//import { PopoverPage } from '../pages/about-popover/about-popover';
//import { AccountPage } from '../pages/account/account';
import { UserData } from '../providers/user-data';
import { Broadcaster } from '../providers/eventEmitter';
//import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { ConferenceData } from '../providers/conference-data';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail';
//import { SessionDetailPage } from '../pages/session-detail/session-detail';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    // PopoverPage,
    // AccountPage,
    // SpeakerListPage,
    // SpeakerDetailPage,
    // SessionDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // AboutPage,
    // PopoverPage,
    // AccountPage,
    // SpeakerListPage,
    // SpeakerDetailPage,
    // SessionDetailPage
  ],
  providers: [
    Api,
    ResponseMessage,
    Camera,
    SplashScreen,
    StatusBar,
    Broadcaster,
    ConferenceData,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserData,
    InAppBrowser
  ]
})
export class AppModule { }
