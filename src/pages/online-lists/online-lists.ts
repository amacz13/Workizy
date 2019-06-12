import { Component } from '@angular/core';
import {LoadingController, ModalController, NavController} from 'ionic-angular';
import {NewListPage} from "../new-list/new-list";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {List} from "../../providers/list/list";
import {ListViewerPage} from "../list-viewer/list-viewer";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";

@Component({
  selector: 'page-online-lists',
  templateUrl: 'online-lists.html'
})
export class OnlineListsPage {

  public viewmode:boolean = false;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public sm: StorageManager, public fm: FirebaseManager, public loadingCtrl: LoadingController) {

  }

  toggleViewMode() {
    this.viewmode = !this.viewmode;
  }

  showNewList() {
    const modal = this.modalCtrl.create(NewListPage,{'online':true});
    modal.present();
  }

  showList(list: List) {
    this.navCtrl.push(ListViewerPage, {list: list});
    //const modal = this.modalCtrl.create(ListViewerPage, {list: list});
    //modal.present();
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
