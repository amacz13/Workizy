import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {UserSettings} from "../../providers/user-settings/user-settings";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public translate: TranslateService, public settings: UserSettings, public fm: FirebaseManager) {
    //translate.setDefaultLang('en');
  }


  signIn() {
    //this.settings.isConnected = true;
    this.fm.getLists();
  }
}
