import { Component } from '@angular/core';
import {AlertController, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {List} from "../../providers/list/list";
import {NewItemPage} from "../new-item/new-item";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {ListItem} from "../../providers/list-item/list-item";
import {Link} from "../../providers/link/link";
import {BrowserTab} from "@ionic-native/browser-tab";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";
import {TranslateService} from "@ngx-translate/core";
import {MyApp} from "../../app/app.component";

@Component({
  selector: 'page-list-viewer',
  templateUrl: 'list-viewer.html',
})
export class ListViewerPage {

  list: List;
  items: ListItem[] = new Array<ListItem>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private iab: InAppBrowser, public sm: StorageManager, public alertCtrl: AlertController, private browserTab: BrowserTab, public fm: FirebaseManager) {
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

  async doDeleteList(){
    console.log("Start rm list");
    this.translate.get("Please wait...").toPromise().then(async text =>{
      let loading = this.loadingCtrl.create({
        content: text
      });
      await loading.present().then(async ()=> {
        for (let it of this.list.items){
          if(it.links != null && it.links.length > 0) {
            for (let l of it.links){
              console.log("Removing link : ",l);
              await this.sm.removeLink(l);
            }
          }
          console.log("Removing item : ",it);
          if (this.list.isSynchronized)  this.fm.deleteItem(it);
          await this.sm.removeItem(it);
        }
        console.log("Removing list : ",this.list);
        if (this.list.isSynchronized)  this.fm.deleteList(this.list);
        await this.sm.removeList(this.list);
        await this.sm.getAll();
        await this.sm.getAll();
        loading.dismiss();
      });
    });
  }

  async deleteList() {
    this.translate.get('Confirm deletion').toPromise().then(title => {
      this.translate.get('Are you sure to delete this list?').toPromise().then(msg => {
        this.translate.get('Cancel').toPromise().then(cancel => {
          this.translate.get('Yes').toPromise().then(yes => {
            let alert = this.alertCtrl.create({
              title: title,
              message: msg,
              buttons: [
                {
                  text: cancel,
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: yes,
                  handler: () => {
                    console.log('Delete clicked');
                    this.doDeleteList();
                    this.navCtrl.pop();
                  }
                }
              ]
            });
            alert.present();
          });
        });
      });
    });
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
    if (MyApp.os == "osx") {
      if (content.includes("http://") || content.includes("https://")){
        const browser = this.iab.create(content.toString(),"_system");
      } else {
        const browser = this.iab.create("https://"+content.toString(),"_system");
      }
    } else if (MyApp.os == "windows") {
      if (content.includes("http://") || content.includes("https://")){
        const browser = this.iab.create(content.toString());
      } else {
        const browser = this.iab.create("https://"+content.toString());
      }
    } else {
      this.browserTab.isAvailable().then(isAvailable => {
        if (content.includes("http://") || content.includes("https://")){
          this.browserTab.openUrl(content.toString());
        } else {
          this.browserTab.openUrl("https://"+content.toString());
        }
      }).catch(() => {
        console.log(MyApp.os);
        const browser = this.iab.create("https://blog.amacz13.fr/workizy-cluf/");
      });
    }
  }

  deleteItem(item: ListItem) {
    this.translate.get('Confirm deletion').toPromise().then( title => {
      this.translate.get('Are you sure to delete this item?').toPromise().then( msg => {
        this.translate.get('Cancel').toPromise().then( cancel => {
          this.translate.get('Yes').toPromise().then( yes => {
            let alert = this.alertCtrl.create({
              title: title,
              message: msg,
              buttons: [
                {
                  text: cancel,
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: yes,
                  handler: () => {
                    console.log('Delete clicked');
                    this.doDeleteItem(item);
                  }
                }
              ]
            });
            alert.present();
        });
      });
    });
    });
  }

  private doDeleteItem(item: ListItem) {
    console.log("Start rm item : ",item);
    this.translate.get("Please wait...").toPromise().then(async text =>{
      let loading = this.loadingCtrl.create({
        content: text
      });
      await loading.present().then(async ()=> {
        if(item.links != null && item.links.length > 0) {
          for (let l of item.links) {
            console.log("Removing link : ", l);
            await this.sm.removeLink(l);
          }
        }
        console.log("Removing item : ",item);
        if (this.list.isSynchronized)  this.fm.deleteItem(item);
        await this.sm.removeItem(item);
        await this.sm.getAll();
        this.items.forEach((it, index) => {
          if (it.id == item.id) {
            this.items.splice(index,1);
          }
        });
        loading.dismiss();
      });
    });
  }
}
