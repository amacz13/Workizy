import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { createConnection } from 'typeorm';

import { TabsPage } from '../pages/tabs/tabs';
import {List} from "../providers/list/list";
import {StorageManager} from "../providers/storage-manager/storage-manager";
import {ListItem} from "../providers/list-item/list-item";
import {Checklist} from "../providers/checklist/checklist";
import {ChecklistItem} from "../providers/checklist-item/checklist-item";
import {Link} from "../providers/link/link";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, sm: StorageManager) {
    platform.ready().then(async() => {
      if(platform.is('cordova')) {
        console.log("[WhatsNext] Using cordova platform...");
        console.log("[WhatsNext] Creating ORM link with database...");
        await createConnection({
          type: 'cordova',
          database: 'wn',
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
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
