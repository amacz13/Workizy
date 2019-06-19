import { Component } from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { createConnection } from 'typeorm';

import {List} from "../providers/list/list";
import {StorageManager} from "../providers/storage-manager/storage-manager";
import {ListItem} from "../providers/list-item/list-item";
import {Checklist} from "../providers/checklist/checklist";
import {ChecklistItem} from "../providers/checklist-item/checklist-item";
import {Link} from "../providers/link/link";
import {FirstStartPage} from "../pages/first-start/first-start";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = FirstStartPage;
  theme:string = ""

  public static storageManager:StorageManager;
  public static internetConnected: boolean = navigator.onLine;
  public static os: string;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, sm: StorageManager, event: Events) {
    MyApp.storageManager = sm;
    if (platform.is('android')) {
      MyApp.os = "android";
    } else if (platform.is('ios')) {
      MyApp.os = "ios";
    } else if (platform.is('windows')) {
      MyApp.os = "windows";
    } else if (platform.is('osx')) {
      MyApp.os = "osx";
    }

    // Device is ready, Cordova plugins & Ionic modules are loaded
    platform.ready().then(async() => {
      if(platform.is('cordova')) {
        // Device is an app (Windows, MacOS, Android or iOS)
        console.log("[WhatsNext] Using cordova platform...");
        console.log("[WhatsNext] Creating ORM link with database...");
        // Creating connection to database
        await createConnection({
          type: 'cordova',
          database: 'workizy-devdb32',
          location: 'default',
          logging: ['error', 'query', 'schema'],
          synchronize: true,
          entities: [
            List,
            ListItem,
            Checklist,
            ChecklistItem,
            Link
          ]
        }).then( connection => {
          sm.connection = connection;
          sm.initRepositories();
        });
      } else {
        console.log("[WhatsNext] Using web platform...");
        console.log("[WhatsNext] Creating ORM link with database...");
        await createConnection({
          type: 'sqljs',
          autoSave: true,
          location: 'browser',
          logging: ['error', 'query', 'schema'],
          synchronize: true,
          entities: [
            List,
            ListItem,
            Checklist,
            ChecklistItem,
            Link
          ]
        }).then( () => {
          sm.initRepositories()
        });
      }
      // Hide the splascreen and create the event listeners
      splashScreen.hide();
      event.subscribe('theme:dark', () => {
        this.setDarkTheme();
      });
      event.subscribe('theme:light', () => {
        this.setLightTheme();
      });
    });
  }

  private setDarkTheme() {
    this.theme = "ionic.theme.dark";
  }

  private setLightTheme() {
    this.theme = "ionic.theme.default";
  }
}
