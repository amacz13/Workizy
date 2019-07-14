import { Component } from '@angular/core';
import {AlertController, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {List} from "../../providers/list/list";
import {NewItemPage} from "../new-item/new-item";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {ListItem} from "../../providers/list-item/list-item";
import {BrowserTab} from "@ionic-native/browser-tab";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";
import {TranslateService} from "@ngx-translate/core";
import {UserSettings} from "../../providers/user-settings/user-settings";
import {LinkUtils} from "../../providers/link-utils/link-utils";
import { Media, MediaObject } from '@ionic-native/media';
import {MyApp} from "../../app/app.component";
import {MusicControls} from "@ionic-native/music-controls";
import {AudioManager} from "../../providers/audio-manager/audio-manager";

@Component({
  selector: 'page-list-viewer',
  templateUrl: 'list-viewer.html',
})
export class ListViewerPage {

  list: List;
  items: ListItem[] = new Array<ListItem>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private iab: InAppBrowser, public sm: StorageManager, public alertCtrl: AlertController, private browserTab: BrowserTab, public fm: FirebaseManager, public settings: UserSettings, public linkUtils: LinkUtils, public am: AudioManager) {
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
        if(item.checklistitems != null && item.checklistitems.length > 0) {
          for (let clitem of item.checklistitems) {
            console.log("Removing ChecklistItem : ", clitem);
            await this.sm.removeChecklistItem(clitem);
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

  getFormattedDate(reminderDate: number):string {
    let d = new Date(reminderDate);
    let today = new Date();
    if (d.getDay() == today.getDay() && d.getMonth() == today.getMonth() && d.getFullYear() == today.getFullYear()) return d.getHours() +":"+d.getMinutes();
    else return d.toLocaleString();
  }

  editList() {

  }
}
