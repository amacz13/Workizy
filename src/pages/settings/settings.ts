import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {UserSettings} from "../../providers/user-settings/user-settings";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";
import {Events, NavController} from "ionic-angular";
import {FirstStartPage} from "../first-start/first-start";
import {NativeStorage} from "@ionic-native/native-storage";
import {MyApp} from "../../app/app.component";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  darkTheme: boolean = false;

  constructor(public storage: Storage,public navCtrl: NavController, public translate: TranslateService, public settings: UserSettings, public fm: FirebaseManager, public event: Events, public nativeStorage: NativeStorage) {
    //translate.setDefaultLang('en');
  }

  signIn() {
    //this.settings.isConnected = true;
    if (MyApp.os != "browser") this.nativeStorage.setItem('connected', 0).then(() => {
      this.nativeStorage.setItem('user', null).then(() => {
        this.nativeStorage.setItem('firstStart', 0).then(() => {
          this.navCtrl.setRoot(FirstStartPage);
        });
      });
    });
    else this.storage.set('connected', 0).then(() => {
      this.storage.set('user', null).then(() => {
        this.storage.set('firstStart', 0).then(() => {
          this.navCtrl.setRoot(FirstStartPage);
        });
      });
    });
  }

  logout() {
    if (MyApp.os != "browser") this.nativeStorage.setItem('connected', 0).then(() => {
      this.nativeStorage.setItem('user', null).then(() => {
        this.nativeStorage.setItem('firstStart', 0).then(() => {
          this.navCtrl.setRoot(FirstStartPage);
        });
      });
    });
    else this.storage.set('connected', 0).then(() => {
      this.storage.set('user', null).then(() => {
        this.storage.set('firstStart', 0).then(() => {
          this.navCtrl.setRoot(FirstStartPage);
        });
      });
    });
  }

  applyTheme() {
    if (this.darkTheme) this.event.publish('theme:dark');
    else this.event.publish('theme:light');
  }
}
