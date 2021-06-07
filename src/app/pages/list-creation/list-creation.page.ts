import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {List} from '../../model/list/list.model';
import {ModalController} from '@ionic/angular';
import {Tag} from '../../model/tag/tag';
import {TranslateService} from '@ngx-translate/core';

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
  tag: any;

  constructor(private modalController: ModalController, private translateService: TranslateService) { }

  ngAfterViewInit(): void {
    this.slider.update();
  }

  ngOnInit() {
    this.initList();
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
    const backgroundId = await this.slider.getActiveIndex();
    this.list.background = this.backgrounds[backgroundId];
    this.list.creationDate = Date.now().toString();
    this.modalController.dismiss(this.list);
  }

  removeTag(i: number) {
    this.list.tags.splice(i, 1);
  }

  addTag(tag: any) {
    if (!this.tag || this.tag.length <= 0) {
      return;
    }
    const t: Tag = new Tag();
    t.name = tag;
    this.list.tags.push(t);
    this.tag = '';
  }

  private initList() {
    this.list.tags = [];
    this.list.cards = [];
  }

  getTagsPlaceholder() {
    return this.list.tags.length === 0 ? this.translateService.instant('page.list-creation.input-tags-placeholder') : null;
  }
}
