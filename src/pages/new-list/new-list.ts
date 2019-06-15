import { Component } from '@angular/core';
import {ActionSheetController, AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {ChooseCoverFromSamplesPage} from "../choose-cover-from-samples/choose-cover-from-samples";
import {List} from "../../providers/list/list";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {ListItem} from "../../providers/list-item/list-item";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {UuidGenerator} from "../../providers/uuid-generator/uuid-generator";

@Component({
  selector: 'page-new-list',
  templateUrl: 'new-list.html',
})
export class NewListPage {

  public listType: String = "general";
  public sync: boolean;
  public title: any;
  public cover: String;
  public coverSource: number = -1;

  shootOptions: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA
  };

  pickOptions: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public asCtrl: ActionSheetController, public translate: TranslateService, public modalCtrl: ModalController, public sm: StorageManager, public camera: Camera, public alertCtrl: AlertController) {
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
                      this.camera.getPicture(this.shootOptions).then((imageData) => {
                        this.cover = 'data:image/jpeg;base64,' + imageData;
                        this.coverSource = 1;
                        console.log(this.cover);
                      }, (err) => {
                        console.error("An error occured while trying to shoot photo : ");
                        console.error(err);
                      });
                    }
                  },{
                    text: pick,
                    handler: () => {
                      console.log('Pick from Gallery clicked');
                      this.camera.getPicture(this.pickOptions).then((imageData) => {
                        if ((imageData.length * (3/4)) - 2 > 1024000) {
                          let alert = this.alertCtrl.create({
                            title: 'File size error',
                            subTitle: 'The size of the file should not exceed 1 MB !',
                            buttons: ['OK']
                          });
                          alert.present();
                        } else {
                          this.cover = 'data:image/jpeg;base64,' + imageData;
                          this.coverSource = 1;
                          console.log(this.cover);
                        }

                      }, (err) => {
                        console.error("An error occured while trying to pick photo : ");
                        console.error(err);
                      });
                    }
                  },{
                    text: samples,
                    handler: () => {
                      console.log('Samples clicked');
                      const samplePicker = this.modalCtrl.create(ChooseCoverFromSamplesPage);
                      samplePicker.onDidDismiss(val => {
                        this.cover = val.picture;
                        console.log("Cover : "+val.picture);
                        this.coverSource = 0;
                      });
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

  async createList() {
    let list: List = new List();
    list.id = UuidGenerator.getUUID();
    list.title = this.title;
    list.isSynchronized = this.sync;
    list.cover = this.cover;
    list.coverSource = this.coverSource;
    list.creationDate = Date.now();
    list.lastEditionDate = Date.now();
    list.listType = this.listType;
    list.items = new Array<ListItem>();
    if (list.isSynchronized) {
      await this.sm.addSyncedList(list);
    } else {
      list.firebaseId = "NOTAPPLICABLE";
      await this.sm.saveLocalList(list);
      await this.sm.getAll();
    }
    console.log("End of new list");
    this.navCtrl.pop();
  }
}
