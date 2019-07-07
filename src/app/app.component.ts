import { Component } from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { createConnection } from 'typeorm';

import {List} from "../providers/list/list";
import {StorageManager} from "../providers/storage-manager/storage-manager";
import {ListItem} from "../providers/list-item/list-item";
import {ChecklistItem} from "../providers/checklist-item/checklist-item";
import {Link} from "../providers/link/link";
import {FirstStartPage} from "../pages/first-start/first-start";
import { WebIntent } from '@ionic-native/web-intent';
import {Device} from "@ionic-native/device";
import {NativeStorage} from "@ionic-native/native-storage";
import {Storage} from "@ionic/storage";
import {UserSettings} from "../providers/user-settings/user-settings";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = FirstStartPage;
  theme:string = "light-theme";

  public static storageManager:StorageManager;
  public static internetConnected: boolean = navigator.onLine;
  public static os: string;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, sm: StorageManager, event: Events, webIntent: WebIntent, device: Device, ns: NativeStorage, storage: Storage) {
    MyApp.storageManager = sm;
    // Device is ready, Cordova plugins & Ionic modules are loaded
    platform.ready().then(async() => {
      console.log(device.platform);
      if (device.platform == "Android") {
        console.log("Platform : Android");
        MyApp.os = "android";
        webIntent.getIntent().then((data) => {
            console.log('Intent OK', data);
            if (data.action == "android.intent.action.SEND"){
              if (data.type == "image/jpeg") {

              } else if (data.type == "text/plain") {

              }
            }
          },
          err => {
            console.log('Intent Error', err);
          });
      } else if (device.platform == "iOS") {
        console.log("Platform : iOS");
        MyApp.os = "ios";
      } else if (device.platform == "Windows") {
        console.log("Platform : Windows");
        MyApp.os = "windows";
      } else if (device.platform == "Mac OS X") {
        console.log("Platform : macOS");
        MyApp.os = "osx";
      } else if (device.platform == "browser") {
        console.log("Platform : Electron / WebBrowser");
        MyApp.os = "browser";
      }

      if (MyApp.os != "browser") ns.getItem('darkTheme').then(val => {
        if (val) {
          this.theme = "dark-theme";
        }
      });
      else storage.get('darkTheme').then(val => {
        if (val) {
          this.theme = "dark-theme";
        }
      });

      if(platform.is('cordova') && device.platform != "browser") {
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
            ChecklistItem,
            Link
          ]
        }).then( () => {
          sm.initRepositories()
        });
      }
      // Hide the splashcreen and create the event listeners
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
    this.theme = "dark-theme";
  }

  private setLightTheme() {
    this.theme = "light-theme";
  }
}
