import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {UserSettings} from "../../providers/user-settings/user-settings";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";
import {Events, NavController} from "ionic-angular";
import {FirstStartPage} from "../first-start/first-start";
import {StatusbarManager} from "../../providers/statusbar-manager/statusbar-manager";
import {LocalStorage} from "../../providers/local-storage/local-storage";
import {LinkUtils} from "../../providers/link-utils/link-utils";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  darkTheme: boolean = false;
  accentColors = ['primary','amber','teal','red','pink','purple','cyan','green','orange','brown'];

  constructor(public storage: LocalStorage,public navCtrl: NavController, public translate: TranslateService, public settings: UserSettings, public fm: FirebaseManager, public event: Events, public sb: StatusbarManager, public linkUtils: LinkUtils) {
    this.storage.get('darkTheme').then(val => {
      this.darkTheme = val;
    });
  }

  signIn() {
    //this.settings.isConnected = true;
    this.storage.set('connected', 0).then(() => {
      this.storage.set('user', null).then(() => {
        this.storage.set('firstStart', 0).then(() => {
          this.navCtrl.setRoot(FirstStartPage);
        });
      });
    });
  }

  logout() {
    this.storage.set('connected', 0).then(() => {
      this.storage.set('user', null).then(() => {
        this.storage.set('firstStart', 0).then(() => {
          this.navCtrl.setRoot(FirstStartPage);
        });
      });
    });
  }

  applyTheme() {
    if (this.darkTheme) {
      this.event.publish('theme:dark');
      this.settings.theme = "dark-theme";
    }
    else {
      this.event.publish('theme:light');
      this.settings.theme = "light-theme";
    }
    this.storage.set('darkTheme',this.darkTheme);
  }

  setAccentColor(color: string) {
    this.settings.accentColor = color;
    this.sb.setStatusBarColor(color);
    this.storage.set('accentColor',this.settings.accentColor);
  }
}
