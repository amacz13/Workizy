import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserSettings} from "../../providers/user-settings/user-settings";
import {TranslateService} from "@ngx-translate/core";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {ListItem} from "../../providers/list-item/list-item";
import {LinkUtils} from "../../providers/link-utils/link-utils";
import {List} from "../../providers/list/list";
import {ListViewerPage} from "../list-viewer/list-viewer";

@IonicPage()
@Component({
  selector: 'page-whats-next',
  templateUrl: 'whats-next.html',
})
export class WhatsNextPage {

  reminders: Map<Date,Array<ListItem>> = new Map<Date,Array<ListItem>>();
  keys: Array<Date> = new Array<Date>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public settings: UserSettings, public translate: TranslateService, public sm: StorageManager, public linkUtils: LinkUtils) {
    this.getWhatsNext();
  }

  getWhatsNext(){
    let allItems = this.sm.allItems;
    let map = new Map<Date,Array<ListItem>>();
    for (let item of allItems) {
      if (item.reminderDate != null) {
        let date = new Date(item.reminderDate.toString());
        if (map.has(date)) {
          let arr = map.get(date);
          arr.push(item);
          map.set(date,arr);
        } else {
          let arr = new Array<ListItem>();
          arr.push(item);
          map.set(date,arr);
        }
      }
    }
    this.reminders = map;
    console.log(map);
  }

  showListFromItem(item: ListItem) {
    let listToOpen:List = null;
    for (let list of this.sm.allLists){
      if (list.id == item.list.id) listToOpen = list;
    }
    if (listToOpen != null) this.navCtrl.push(ListViewerPage, {list: listToOpen});
  }


}
