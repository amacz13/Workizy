import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Card} from '../../model/card/card.model';
import {CameraService} from '../../services/camera/camera.service';

@Component({
  selector: 'app-card-creation',
  templateUrl: './card-creation.page.html',
  styleUrls: ['./card-creation.page.scss'],
})
export class CardCreationPage implements OnInit {

  @Input() card: Card;

  constructor(private modalController: ModalController, private cameraService: CameraService) { }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

  create() {
    let now = new Date();
    let nowAsDate = now.getUTCDate()+'/'+(now.getUTCMonth()+1)+'/'+now.getUTCFullYear()+' - '+now.getUTCHours()+':'+now.getUTCSeconds()
    this.card.creationDate = nowAsDate;
    this.card.lastUpdateDate = nowAsDate;
    this.modalController.dismiss(this.card);
  }

  isCardValid(): boolean {
    return this.card.title && this.card.title.length > 0;
  }

  selectPicture() {
    this.cameraService.getPhoto().then( result => {
      this.card.image = 'data:image/jpg;base64,'+result.base64String
    }).catch();
  }
}
