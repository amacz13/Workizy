import { Component } from '@angular/core';
import {LoadingController, ModalController, NavController} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {Encryption} from "../../providers/encryption/encryption";
import {NewListPage} from "../new-list/new-list";
import {List} from "../../providers/list/list";
import {ListViewerPage} from "../list-viewer/list-viewer";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public viewmode:boolean = false;

  constructor(public navCtrl: NavController, public translate: TranslateService, public sm: StorageManager, public crypt: Encryption, public modalCtrl: ModalController, public fm: FirebaseManager, public loadingCtrl: LoadingController) {
    translate.setDefaultLang('fr');
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
  }

  showNewList() {
    const modal = this.modalCtrl.create(NewListPage);
    modal.present();
  }

  showList(list: List){
    const modal = this.modalCtrl.create(ListViewerPage, {list: list});
    modal.present();
  }

  forceSync() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(()=> {
      this.fm.sync().then(() => loading.dismiss());
    });
  }
}
