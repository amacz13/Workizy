import { Component } from '@angular/core';
import {LoadingController, ModalController, NavController} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {Encryption} from "../../providers/encryption/encryption";
import {NewListPage} from "../new-list/new-list";
import {List} from "../../providers/list/list";
import {ListViewerPage} from "../list-viewer/list-viewer";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";
import {UserSettings} from "../../providers/user-settings/user-settings";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {InAppPurchase2} from "@ionic-native/in-app-purchase-2";
import {LinkUtils} from "../../providers/link-utils/link-utils";
import {ListItem} from "../../providers/list-item/list-item";
import {Observable} from "rxjs";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public viewmode:boolean = false;
  showSearch: boolean = false;
  searchInput: string;
  welcomePhrase:String;

  constructor(public navCtrl: NavController, public translate: TranslateService, public sm: StorageManager, public crypt: Encryption, public modalCtrl: ModalController, public fm: FirebaseManager, public loadingCtrl: LoadingController, public settings: UserSettings, public ln: LocalNotifications, public store: InAppPurchase2, public linkUtils: LinkUtils) {
    this.getWelcomePhrase().subscribe(val => this.welcomePhrase = val);
  }


  toggleViewMode() {
    this.viewmode = !this.viewmode;
    this.ln.schedule({
      title: 'My first notification',
      text: 'Thats pretty easy...',
      foreground: true
    });
  }

  showNewList() {
    const modal = this.modalCtrl.create(NewListPage);
    //const modal = this.modalCtrl.create(NewListPage,null,{cssClass: this.settings.theme});
    modal.present();
  }

  showList(list: List){
    this.navCtrl.push(ListViewerPage, {list: list});
    //const modal = this.modalCtrl.create(ListViewerPage, {list: list});
    //modal.present();
  }

  async forceSync() {
    this.translate.get("Please wait...").toPromise().then(async text =>{
      let loading = this.loadingCtrl.create({
        content: text
      });
      await loading.present().then(()=> {
        this.fm.sync().then(() => loading.dismiss());
      });
    });
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  showListFromItem(item: ListItem) {
    let listToOpen:List = null;
    for (let list of this.sm.allLists){
      if (list.id == item.list.id) listToOpen = list;
    }
    if (listToOpen != null) this.navCtrl.push(ListViewerPage, {list: listToOpen});
  }

  getWelcomePhrase():Observable<String> {
    let date:Date = new Date();
    if (date.getHours() < 7) {
      return this.translate.get('Good night');
    } else if (date.getHours() < 12) {
      return this.translate.get('Good morning');
    } else if (date.getHours() < 18) {
      return this.translate.get('Good afternoon');
    } else {
      return this.translate.get('Good evening');
    }
  }
}
