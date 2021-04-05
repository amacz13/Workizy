import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {List} from '../../model/list/list.model';
import {ActionSheetController, AlertController, IonRouterOutlet, ModalController} from '@ionic/angular';
import {ListService} from '../../services/list/list.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'workizy-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() list: List;
  @Input() preview: boolean = false;

  constructor(public actionSheetController: ActionSheetController, public alertController: AlertController, public listService: ListService,
              private translate: TranslateService) { }

  ngOnInit() {}

  async onLongPress() {
    if (this.preview) return;
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
      header: this.translate.instant('dialog.delete-list.title'),
      message: this.translate.instant('dialog.delete-list.message'),
      buttons: [
        {
          text: this.translate.instant('general.button.cancel'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translate.instant('general.button.delete'),
          handler: () => {
            this.performDelete();
          }
        }
      ]
    });

    await alert.present();
  }

  performDelete() {
    this.listService.deleteList(this.list);
    this.onDelete.emit();
  }

  viewList() {
    this.onClick.emit();
  }
}
