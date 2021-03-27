import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {List} from '../../model/list/list.model';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-list-creation',
  templateUrl: './list-creation.page.html',
  styleUrls: ['./list-creation.page.scss'],
})
export class ListCreationPage implements OnInit, AfterViewInit {

  @ViewChild('slider') slider;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  backgrounds = ['background1','background2','background3','background4','background5','background6'];

  list: List = new List();

  constructor(private modalController: ModalController) { }

  ngAfterViewInit(): void {
    this.slider.update();
  }

  ngOnInit() {
  }

  getListPreviewWithBackground(background: string): List {
    let listCopy: List = JSON.parse(JSON.stringify(this.list));
    listCopy.background = background;
    return listCopy;
  }

  close() {
    this.modalController.dismiss();
  }

  async createList() {
    this.list.id = Math.random().toString(36).substr(2, 9);
    let backgroundId = await this.slider.getActiveIndex()
    this.list.background = this.backgrounds[backgroundId];
    this.list.creationDate = Date.now().toString();
    this.modalController.dismiss(this.list);
  }
}
