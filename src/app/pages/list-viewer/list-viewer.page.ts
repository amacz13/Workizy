import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {List} from '../../model/list/list.model';
import {IonRouterOutlet, ModalController} from '@ionic/angular';
import {CardCreationPage} from '../card-creation/card-creation.page';
import {Router} from '@angular/router';
import {Card} from '../../model/card/card.model';
import {ListService} from '../../services/list/list.service';
import {CameraService} from '../../services/camera/camera.service';

@Component({
  selector: 'app-list-viewer',
  templateUrl: './list-viewer.page.html',
  styleUrls: ['./list-viewer.page.scss'],
})
export class ListViewerPage implements OnInit {

  list: List;


  constructor(private modalController: ModalController, private router: Router, private routerOutlet: IonRouterOutlet, private listService: ListService, private cameraServices: CameraService) {
    this.list = this.router.getCurrentNavigation().extras.state.list;
  }

  ngOnInit() {
  }

  async addNewCard() {
    const modal = await this.modalController.create({
      component: CardCreationPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'card': new Card()
      }
    });

    modal.onDidDismiss().then( modalResult => {
      if (modalResult && modalResult.data) {
        console.log('Saving card : ',modalResult.data);
        if (!this.list.cards) this.list.cards = [];
        this.list.cards.push(modalResult.data);
        this.listService.saveList(this.list);
      }
    });
    await modal.present();
  }

  deleteCard(card: Card) {
    let newCards: Card[] = [];
    for (let c of this.list.cards) if (c.id !== card.id) newCards.push(c);
    this.list.cards = newCards;
    this.listService.saveList(this.list);
    if (card.image) this.cameraServices.deletePicture(card.image);
  }
}
