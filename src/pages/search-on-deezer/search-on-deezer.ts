import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserSettings} from "../../providers/user-settings/user-settings";
@IonicPage()
@Component({
  selector: 'page-search-on-deezer',
  templateUrl: 'search-on-deezer.html',
})
export class SearchOnDeezerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public settings: UserSettings) {
  }


  close() {
    this.navCtrl.pop();
  }

}
