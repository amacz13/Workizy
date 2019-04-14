import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LocalListsPage } from '../pages/local-lists/local-lists';
import { OnlineListsPage } from '../pages/online-lists/online-lists';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {SQLite} from "@ionic-native/sqlite";
import { List } from '../providers/list/list';
import { ListItem } from '../providers/list-item/list-item';
import { StorageManager } from '../providers/storage-manager/storage-manager';
import { Checklist } from '../providers/checklist/checklist';
import { ChecklistItem } from '../providers/checklist-item/checklist-item';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NativeStorage} from "@ionic-native/native-storage";
import {SettingsPage} from "../pages/settings/settings";
import { Encryption } from '../providers/encryption/encryption';
import {AES256} from "@ionic-native/aes-256";
import {Device} from "@ionic-native/device";

@NgModule({
  declarations: [
    MyApp,
    LocalListsPage,
    OnlineListsPage,
    HomePage,
    TabsPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LocalListsPage,
    OnlineListsPage,
    HomePage,
    TabsPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    List,
    ListItem,
    StorageManager,
    Checklist,
    ChecklistItem,
    HttpClient,
    NativeStorage,
    SQLite,
    Encryption,
    AES256,
    Device
  ]
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

