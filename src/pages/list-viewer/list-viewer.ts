import { Component } from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {List} from "../../providers/list/list";
import {NewItemPage} from "../new-item/new-item";

@Component({
  selector: 'page-list-viewer',
  templateUrl: 'list-viewer.html',
})
export class ListViewerPage {

  list: List;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.list = navParams.get("list");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListViewerPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  showNewItem() {
    const modal = this.modalCtrl.create(NewItemPage);
    modal.present();
  }
}
