import { Component, OnInit } from '@angular/core';
import { Card } from '../../../model/card/card.model';
import { Router } from '@angular/router';
import { List } from '../../../model/list/list.model';
import {IonRouterOutlet, ModalController} from '@ionic/angular';
import {ListCreationPage} from '../../list-creation/list-creation.page';
import {LocalStorageService} from '../../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  card: Card = new Card();
  lists: List[] = [];

  constructor(private router: Router, public modalController: ModalController, public routerOutlet: IonRouterOutlet, private localStorageService: LocalStorageService) {
    this.card.title = 'Title';
    this.card.description = 'This is a description';
    this.card.creationDate = '04/09/2021';
  }

  ngOnInit() {
    this.localStorageService.getLists().then( lists => this.lists = lists);
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
        this.localStorageService.saveList(modalResult.data).then( () => {
          this.localStorageService.getLists().then( lists => this.lists = lists);
        });
      }
    });
    await modal.present();
  }
}
