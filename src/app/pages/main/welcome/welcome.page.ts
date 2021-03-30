import { Component, OnInit } from '@angular/core';
import { Card } from '../../../model/card/card.model';
import { Router } from '@angular/router';
import { List } from '../../../model/list/list.model';
import {IonRouterOutlet, ModalController} from '@ionic/angular';
import {ListCreationPage} from '../../list-creation/list-creation.page';
import {ListService} from '../../../services/list/list.service';
import {ListViewerPage} from '../../list-viewer/list-viewer.page';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  card: Card = new Card();
  lists: List[] = [];

  constructor(private router: Router, public modalController: ModalController, public routerOutlet: IonRouterOutlet, private listService: ListService) {
    this.card.title = 'Title';
    this.card.description = 'This is a description';
    this.card.creationDate = '04/09/2021';
  }

  ngOnInit() {
    this.refreshLists();
  }

  goToSettings() {
      this.router.navigate(['/settings'])
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async displayCreateListModal() {
    const modal = await this.modalController.create({
      component: ListCreationPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.parentOutlet.nativeEl
    });
    modal.onDidDismiss().then( modalResult => {
      if (modalResult && modalResult.data) {
        console.log('Saving list : ',modalResult.data);
        this.listService.saveList(modalResult.data).then( () => {
          this.refreshLists();
        });
      }
    });
    await modal.present();
  }

  refreshLists() {
    this.listService.getAllLists().then( lists => this.lists = lists.sort(((a, b) => Date.parse(a.creationDate) >= Date.parse(b.creationDate) ? 1 : -1)));
  }

  async showList(list: List) {
    this.router.navigate(['/list-viewer'], {state: {list: list}});
  }
}
