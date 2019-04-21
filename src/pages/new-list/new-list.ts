import { Component } from '@angular/core';
import {ActionSheetController, ModalController, NavController, NavParams} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {ChooseCoverFromSamplesPage} from "../choose-cover-from-samples/choose-cover-from-samples";

@Component({
  selector: 'page-new-list',
  templateUrl: 'new-list.html',
})
export class NewListPage {
  public listType: any;

  public sync: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public asCtrl: ActionSheetController, public translate: TranslateService, public modalCtrl: ModalController) {
    if(navParams.get('online') == null) {
      this.sync = false;
    } else {
      this.sync = navParams.get('online');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewListPage');
  }

  close() {
    this.navCtrl.pop();
  }

  chooseCover() {
    this.translate.get('Choose a Cover Picture').toPromise().then( title => {
      this.translate.get('Shoot').toPromise().then( shoot => {
        this.translate.get('Pick from Gallery').toPromise().then( pick => {
          this.translate.get('Pick from Samples').toPromise().then( samples => {
            this.translate.get('Cancel').toPromise().then( cancel => {
              const actionSheet = this.asCtrl.create({
                title: title,
                buttons: [
                  {
                    text: shoot,
                    handler: () => {
                      console.log('Shoot clicked');
                    }
                  },{
                    text: pick,
                    handler: () => {
                      console.log('Pick from Gallery clicked');
                    }
                  },{
                    text: samples,
                    handler: () => {
                      console.log('Samples clicked');
                      const samplePicker = this.modalCtrl.create(ChooseCoverFromSamplesPage);
                      samplePicker.onDidDismiss(pic => console.log(pic))
                      samplePicker.present();
                    }
                  },{
                    text: cancel,
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                  }
                ]
              });
              actionSheet.present();
            });
          });
        });
      });
    });

  }
}
