import { Component } from '@angular/core';
import {ModalController, NavController} from 'ionic-angular';
import {NewListPage} from "../new-list/new-list";

@Component({
  selector: 'page-local-lists',
  templateUrl: 'local-lists.html'
})
export class LocalListsPage {

  public viewmode:boolean = false;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }

  toggleViewMode() {
    this.viewmode = !this.viewmode;
  }

  showNewList() {
    const modal = this.modalCtrl.create(NewListPage,{'online':false});
    modal.present();

  }
}
