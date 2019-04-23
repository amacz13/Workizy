import { Component } from '@angular/core';
import {ModalController, NavController} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {Encryption} from "../../providers/encryption/encryption";
import {NewListPage} from "../new-list/new-list";
import {List} from "../../providers/list/list";
import {ListViewerPage} from "../list-viewer/list-viewer";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public viewmode:boolean = false;

  constructor(public navCtrl: NavController, public translate: TranslateService, public sm: StorageManager, public crypt: Encryption, public modalCtrl: ModalController) {
    translate.setDefaultLang('fr');
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
}
