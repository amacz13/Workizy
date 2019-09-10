import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { LocalListsPage } from '../local-lists/local-lists';
import { OnlineListsPage } from '../online-lists/online-lists';
import { HomePage } from '../home/home';
import {TranslateService} from "@ngx-translate/core";
import {UserSettings} from "../../providers/user-settings/user-settings";
import {MyApp} from "../../app/app.component";
import {WhatsNextPage} from "../whats-next/whats-next";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = LocalListsPage;
  tab3Root = OnlineListsPage;
  tab4Root = SettingsPage;
  tab5Root = WhatsNextPage;
  internetConnected: boolean = MyApp.internetConnected;

  constructor(public translate: TranslateService, public settings: UserSettings) {

  }

}
