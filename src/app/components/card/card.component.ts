import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../model/card/card.model';
import {LinklistElement} from '../../model/linklist-element/linklist-element.model';
import {ChecklistElement} from '../../model/checklist-element/checklist-element.model';
import {CameraService} from '../../services/camera/camera.service';
import {ActionSheetController, AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

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

  constructor(private cameraService: CameraService, public actionSheetController: ActionSheetController, public alertController: AlertController,
              private translate: TranslateService) {
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
      header: this.translate.instant('general.action-sheet.title'),
      buttons: [{
        text: this.translate.instant('general.button.delete'),
        role: 'destructive',
        handler: () => {
          this.beforeDelete();
        }
      }, {
        text: this.translate.instant('general.button.share'),
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: this.translate.instant('general.button.synchronize'),
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: this.translate.instant('general.button.cancel'),
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
      header: this.translate.instant('dialog.delete-card.title'),
      message: this.translate.instant('dialog.delete-card.message'),
      buttons: [
        {
          text: this.translate.instant('general.button.cancel'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translate.instant('general.button.delete'),
          handler: () => {
            this.onDelete.emit();
          }
        }
      ]
    });

    await alert.present();
  }
}
