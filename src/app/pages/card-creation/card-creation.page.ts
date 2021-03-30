import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Card} from '../../model/card/card.model';

@Component({
  selector: 'app-card-creation',
  templateUrl: './card-creation.page.html',
  styleUrls: ['./card-creation.page.scss'],
})
export class CardCreationPage implements OnInit {

  @Input() card: Card;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

  create() {
    this.card.creationDate = Date.now().toString();
    this.card.lastUpdateDate = Date.now().toString();
    this.modalController.dismiss(this.card);
  }

  isCardValid(): boolean {
    return this.card.title && this.card.title.length > 0;
  }
}
