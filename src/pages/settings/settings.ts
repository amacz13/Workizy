import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {UserSettings} from "../../providers/user-settings/user-settings";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public translate: TranslateService, public settings: UserSettings) {
    //translate.setDefaultLang('en');
  }


  signIn() {
    this.settings.isConnected = true;
  }
}
