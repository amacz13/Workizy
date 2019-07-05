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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public viewmode:boolean = false;

  constructor(public navCtrl: NavController, public translate: TranslateService, public sm: StorageManager, public crypt: Encryption, public modalCtrl: ModalController, public fm: FirebaseManager, public loadingCtrl: LoadingController, public settings: UserSettings, public ln: LocalNotifications, public store: InAppPurchase2) {
    //HomePage.storageManager = sm;
    //Account Creation
    //firebase.auth().createUserWithEmailAndPassword("axel.maczkowiak@live.fr","test123").then(val => console.log("User created : ",val));

    //Account Login
    //firebase.auth().signInWithEmailAndPassword("axel.maczkowiak@outlook.fr","test123").then(val => console.log("User created : ",val));

    //FB Login
    //this.auth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(val => console.log("User connected : ",val));
    //firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(val => console.log("User connected : ",val));


    //Google Login
    //this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(val => console.log("User connected : ",val));
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
}
