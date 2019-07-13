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

@Component({
  selector: 'page-list-viewer',
  templateUrl: 'list-viewer.html',
})
export class ListViewerPage {

  list: List;
  items: ListItem[] = new Array<ListItem>();

  currentMusic: string = null;

  audioMedia: MediaObject;
  jsAudio : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private iab: InAppBrowser, public sm: StorageManager, public alertCtrl: AlertController, private browserTab: BrowserTab, public fm: FirebaseManager, public settings: UserSettings, public linkUtils: LinkUtils, public media: Media, public musicControls: MusicControls) {
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

  playOrStopMusic(item: ListItem) {
    let musicURL = item.musicURL.toString();
    console.log("Playing song : ",musicURL);
    if (MyApp.os == "osx"){
      if (this.currentMusic == null) {
        this.jsAudio = new Audio(musicURL);
        this.currentMusic = musicURL;
        this.jsAudio.play();
        this.jsAudio.onended = (event) => {
          console.log("End of playback !");
          this.currentMusic = null;
          document.title = "Workizy";
        };
        if (item.title != null || item.textContent != null) document.title = item.title + " - " + item.textContent;
      } else {
        this.jsAudio.pause();
        this.currentMusic = null;
      }
    } else {
      if (this.currentMusic == null) {
        this.audioMedia = this.media.create(musicURL);
        this.currentMusic = musicURL;
        this.audioMedia.onStatusUpdate.subscribe(status => {
          console.log("Audio status : ",status);
          if (status == 4) {
            console.log("Audio Stopped !");
            this.currentMusic = null;
          }
        });
        this.audioMedia.play();
        this.musicControls.create({
          track       : 'Song Preview',        // optional, default : ''
          artist      : 'Unknown Artist',                       // optional, default : ''
          cover       : 'assets/imgs/logo.png',      // optional, default : nothing
          // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
          //           or a remote url ('http://...', 'https://...', 'ftp://...')
          isPlaying   : true,                         // optional, default : true
          dismissable : false,                         // optional, default : false

          // hide previous/next/close buttons:
          hasPrev   : false,      // show previous button, optional, default: true
          hasNext   : false,      // show next button, optional, default: true
          hasClose  : true,       // show close button, optional, default: false

          // iOS only, optional
          album       : 'Unknown Album',     // optional, default: ''
          //duration : 60, // optional, default: 0
          //elapsed : 10, // optional, default: 0
          //hasSkipForward : true,  // show skip forward button, optional, default: false
          //hasSkipBackward : true, // show skip backward button, optional, default: false
          //skipForwardInterval: 15, // display number for skip forward, optional, default: 0
          //skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
          //hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional

          // Android only, optional
          // text displayed in the status bar when the notification (and the ticker) are updated, optional
          ticker    : 'Now playing "Song Preview"',
          // All icons default to their built-in android equivalents
          playIcon: 'media_play',
          pauseIcon: 'media_pause',
          prevIcon: 'media_prev',
          nextIcon: 'media_next',
          closeIcon: 'media_close',
          notificationIcon: 'notification'
        });
      } else {
        this.audioMedia.stop();
        this.currentMusic = null;
      }
    }
  }

  editList() {

  }
}
