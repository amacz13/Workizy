import { Component } from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {List} from "../../providers/list/list";
import {NewItemPage} from "../new-item/new-item";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {ListItem} from "../../providers/list-item/list-item";

@Component({
  selector: 'page-list-viewer',
  templateUrl: 'list-viewer.html',
})
export class ListViewerPage {

  list: List;
  items: ListItem[] = new Array<ListItem>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public sm: StorageManager) {
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
}
