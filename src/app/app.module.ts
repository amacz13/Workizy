import {NgModule, ErrorHandler} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LocalListsPage } from '../pages/local-lists/local-lists';
import { OnlineListsPage } from '../pages/online-lists/online-lists';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from "@ionic-native/sqlite";
import { List } from '../providers/list/list';
import { ListItem } from '../providers/list-item/list-item';
import { StorageManager } from '../providers/storage-manager/storage-manager';
import { Checklist } from '../providers/checklist/checklist';
import { ChecklistItem } from '../providers/checklist-item/checklist-item';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NativeStorage } from "@ionic-native/native-storage";
import { SettingsPage } from "../pages/settings/settings";
import { Encryption } from '../providers/encryption/encryption';
import { AES256 } from "@ionic-native/aes-256";
import { Device } from "@ionic-native/device";
import { UserSettings } from '../providers/user-settings/user-settings';
import { NewListPage } from "../pages/new-list/new-list";
import { ChooseCoverFromSamplesPage } from "../pages/choose-cover-from-samples/choose-cover-from-samples";
import { ListViewerPage } from "../pages/list-viewer/list-viewer";
import { NewItemPage } from "../pages/new-item/new-item";
import { Camera } from "@ionic-native/camera";
import { Link } from '../providers/link/link';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { BrowserTab } from "@ionic-native/browser-tab";
import { FirebaseManager } from '../providers/firebase-manager/firebase-manager';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import {environment} from "../environment/environment";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { LoginPage } from "../pages/login/login";
import { UuidGenerator } from '../providers/uuid-generator/uuid-generator';

@NgModule({
  declarations: [
    MyApp,
    LocalListsPage,
    OnlineListsPage,
    HomePage,
    TabsPage,
    SettingsPage,
    NewListPage,
    ChooseCoverFromSamplesPage,
    ListViewerPage,
    NewItemPage,
    LoginPage
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp)
    //IonicModule.forRoot(MyApp, {mode: 'wp'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LocalListsPage,
    OnlineListsPage,
    HomePage,
    TabsPage,
    SettingsPage,
    NewListPage,
    ChooseCoverFromSamplesPage,
    ListViewerPage,
    NewItemPage,
    LoginPage
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
    Device,
    UserSettings,
    Camera,
    Link,
    InAppBrowser,
    BrowserTab,
    FirebaseManager,
    UuidGenerator
  ]
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

