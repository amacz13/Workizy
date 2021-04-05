import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../model/card/card.model';
import {LinklistElement} from '../../model/linklist-element/linklist-element.model';
import {ChecklistElement} from '../../model/checklist-element/checklist-element.model';
import {CameraService} from '../../services/camera/camera.service';
import {ActionSheetController, AlertController} from '@ionic/angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'workizy-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() card: Card;
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();

  base64Picture: string;

  constructor(private cameraService: CameraService, public actionSheetController: ActionSheetController, public alertController: AlertController) {
  }

  ngOnInit() {
    if (this.card.image) this.getPicture();
  }

  linkClicked() {

  }

  getFormattedDate(): string {
    return this.card.creationDate
  }

  getPicture() {
      this.cameraService.getPicture(this.card.image).then(picture => this.base64Picture = picture);
  }

  async onLongPress() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.beforeDelete();
        }
      }, {
        text: 'Share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Synchronize',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async beforeDelete() {
    const alert = await this.alertController.create({
      header: 'Delete card',
      message: 'Are you sure you want to delete this card?<br>Data will not be recoverable!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
          handler: () => {
            this.onDelete.emit();
          }
        }
      ]
    });

    await alert.present();
  }
}
