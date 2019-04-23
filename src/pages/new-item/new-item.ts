import { Component } from '@angular/core';
import {ActionSheetController, AlertController, NavController, NavParams} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Link} from "../../providers/link/link";
import {ChecklistItem} from "../../providers/checklist-item/checklist-item";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {BrowserTab} from "@ionic-native/browser-tab";

@Component({
  selector: 'page-new-item',
  templateUrl: 'new-item.html',
})

export class NewItemPage {
  title: String;
  textContent: String;
  reminderEnabled: boolean = false;
  reminderDate: any;
  picture: String;

  shootOptions: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA
  };

  pickOptions: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  };
  links: Link[] = new Array<Link>();
  tasks: ChecklistItem[] = new Array<ChecklistItem>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public asCtrl: ActionSheetController, private camera: Camera, private alertCtrl: AlertController, private iab: InAppBrowser, private browserTab: BrowserTab) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewItemPage');
  }

  createItem() {

  }

  choosePicture() {
      this.translate.get('Choose a Picture').toPromise().then( title => {
        this.translate.get('Shoot').toPromise().then( shoot => {
          this.translate.get('Pick from Gallery').toPromise().then( pick => {
              this.translate.get('Cancel').toPromise().then( cancel => {
                const actionSheet = this.asCtrl.create({
                  title: title,
                  buttons: [
                    {
                      text: shoot,
                      handler: () => {
                        console.log('Shoot clicked');
                        this.camera.getPicture(this.shootOptions).then((imageData) => {
                          this.picture = 'data:image/jpeg;base64,' + imageData;
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
                          this.picture = 'data:image/jpeg;base64,' + imageData;
                        }, (err) => {
                          console.error("An error occured while trying to pick photo : ");
                          console.error(err);
                        });
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
  }

  close() {
    this.navCtrl.pop();
  }

  getDateNow() {
    return new Date().toISOString();
  }

  getMaxDate() {
    let date = new Date();
    return new Date(date.getFullYear()+25,12,31,23,59).toISOString();
  }

  createLink() {
    let alert = this.alertCtrl.create({
      title: 'New Link',
      inputs: [
        {
          name: 'content',
          placeholder: 'Link',
          type: 'url'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            let link: Link = new Link();
            link.content = data.content;
            this.links.push(link);
          }
        }
      ]
    });
    alert.present();
  }

  getIcon(link: Link) {
    if (link.content.includes("youtube.com") || link.content.includes("youtu.be")) {
      return "logo-youtube";
    } else if (link.content.includes("facebook.com") || link.content.includes("fb.me")){
      return "logo-facebook";
    } else if (link.content.includes("twitter.com") || link.content.includes("t.co")){
      return "logo-twitter";
    } else if (link.content.includes("twitch.com")){
      return "logo-twitch";
    } else if (link.content.includes("github.com")){
      return "logo-github";
    } else if (link.content.includes("instagram.com")){
      return "logo-instagram";
    } else if (link.content.includes("linkedin.com") || link.content.includes("linked.in")){
      return "logo-linkedin";
    } else if (link.content.includes("pinterest.com")){
      return "logo-pinterest";
    }
  }

  openLink(content: String) {

    this.browserTab.isAvailable().then(isAvailable => {
      if (isAvailable) {
        if (content.includes("http://") || content.includes("https://")){
          this.browserTab.openUrl(content.toString());
        } else {
          this.browserTab.openUrl("https://"+content.toString());
        }
      } else {
        if (content.includes("http://") || content.includes("https://")){
          const browser = this.iab.create(content.toString());
        } else {
          const browser = this.iab.create("https://"+content.toString());
        }
      }
    });



  }
}
