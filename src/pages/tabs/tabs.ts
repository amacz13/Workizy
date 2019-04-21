import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { LocalListsPage } from '../local-lists/local-lists';
import { OnlineListsPage } from '../online-lists/online-lists';
import { HomePage } from '../home/home';
import {TranslateService} from "@ngx-translate/core";
import {UserSettings} from "../../providers/user-settings/user-settings";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = LocalListsPage;
  tab3Root = OnlineListsPage;
  tab4Root = SettingsPage;

  constructor(public translate: TranslateService, public settings: UserSettings) {
    translate.setDefaultLang('en');
  }
}
