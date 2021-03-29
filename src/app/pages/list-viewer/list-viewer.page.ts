import {Component, Input, OnInit} from '@angular/core';
import {List} from '../../model/list/list.model';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-list-viewer',
  templateUrl: './list-viewer.page.html',
  styleUrls: ['./list-viewer.page.scss'],
})
export class ListViewerPage implements OnInit {

  @Input() list: List;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }
}
