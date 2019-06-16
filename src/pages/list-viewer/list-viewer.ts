import { Component } from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import {List} from "../../providers/list/list";
import {NewItemPage} from "../new-item/new-item";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {ListItem} from "../../providers/list-item/list-item";
import {Link} from "../../providers/link/link";
import {BrowserTab} from "@ionic-native/browser-tab";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@Component({
  selector: 'page-list-viewer',
  templateUrl: 'list-viewer.html',
})
export class ListViewerPage {

  list: List;
  items: ListItem[] = new Array<ListItem>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private iab: InAppBrowser, public sm: StorageManager, public alertCtrl: AlertController, private browserTab: BrowserTab) {
    this.list = navParams.get("list");
    //this.items = this.sm.getListItems(this.list);
    this.items = this.list.items;
    console.log("List :");
    console.log(this.list);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListViewerPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  showNewItem() {
    const modal = this.modalCtrl.create(NewItemPage, {list: this.list});
    modal.onDidDismiss(val => {
      this.list = val.list;
    });
    modal.present();
  }

  showItem(item: ListItem) {
    
  }

  deleteList() {
    let alert = this.alertCtrl.create({
      title: 'Confirm deletion',
      message: 'Are you sure to delete this list?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Delete clicked');
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  getIcon(link: Link) {
    if (link.content.includes("youtube.com") || link.content.includes("youtu.be")) {
      return "logo-youtube";
    } else if (link.content.includes("facebook.com") || link.content.includes("fb.me")){
      return "logo-facebook";
    } else if (link.content.includes("twitter.com") || link.content.includes("t.co")){
      return "logo-twitter";
    } else if (link.content.includes("twitch.com")){
      return "logo-twitch";
    } else if (link.content.includes("github.com")){
      return "logo-github";
    } else if (link.content.includes("instagram.com")){
      return "logo-instagram";
    } else if (link.content.includes("linkedin.com") || link.content.includes("linked.in")){
      return "logo-linkedin";
    } else if (link.content.includes("pinterest.com")){
      return "logo-pinterest";
    } else {
      return "link";
    }
  }

  openLink(content: String) {
    this.browserTab.isAvailable().then(isAvailable => {
      if (isAvailable) {
        if (content.includes("http://") || content.includes("https://")){
          this.browserTab.openUrl(content.toString());
        } else {
          this.browserTab.openUrl("https://"+content.toString());
        }
      } else {
        if (content.includes("http://") || content.includes("https://")){
          const browser = this.iab.create(content.toString());
        } else {
          const browser = this.iab.create("https://"+content.toString());
        }
      }
    });
  }
}
