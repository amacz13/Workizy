import { Injectable } from '@angular/core';
import {ChooseCoverFromSamplesPage} from "../../pages/choose-cover-from-samples/choose-cover-from-samples";
import {TranslateService} from "@ngx-translate/core";
import {ActionSheetController, AlertController, ModalController} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";

@Injectable()
export class PictureChooser {


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

  constructor(public translate: TranslateService, public asCtrl: ActionSheetController, public camera: Camera, public alertCtrl: AlertController, public modalCtrl: ModalController) {
  }

  choosePicture(enableSamples: boolean){
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
                        let result = new String[2];
                        result[0] = 'data:image/jpeg;base64,' + imageData;
                        result[1] = 1;
                        //console.log(this.cover);
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
                          let result = new String [2];
                          result[0] = 'data:image/jpeg;base64,' + imageData;
                          result[1] = 1;
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
                        let result = new String[2];
                        result[0] = val.picture;
                        result[1] = 0;
                        return result;
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

}
