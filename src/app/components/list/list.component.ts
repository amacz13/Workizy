import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {List} from '../../model/list/list.model';
import {ActionSheetController, AlertController, IonRouterOutlet, ModalController} from '@ionic/angular';
import {ListService} from '../../services/list/list.service';
import {ListCreationPage} from '../../pages/list-creation/list-creation.page';
import {ListViewerPage} from '../../pages/list-viewer/list-viewer.page';

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

  constructor(public actionSheetController: ActionSheetController, public alertController: AlertController, public listService: ListService) { }

  ngOnInit() {}

  async onLongPress() {
    if (this.preview) return;
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
      header: 'Delete list',
      message: 'Are you sure you want to delete this list?<br>Data will not be recoverable!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
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
