import { Component } from '@angular/core';
import {ActionSheetController, AlertController, NavController, NavParams, ViewController} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Link} from "../../providers/link/link";
import {ChecklistItem} from "../../providers/checklist-item/checklist-item";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {BrowserTab} from "@ionic-native/browser-tab";
import {ListItem} from "../../providers/list-item/list-item";
import {List} from "../../providers/list/list";
import {StorageManager} from "../../providers/storage-manager/storage-manager";
import {UuidGenerator} from "../../providers/uuid-generator/uuid-generator";
import {MyApp} from "../../app/app.component";
import {UserSettings} from "../../providers/user-settings/user-settings";

@Component({
  selector: 'page-new-item',
  templateUrl: 'new-item.html',
})

export class NewItemPage {
  title: String = null;
  textContent: String = null;
  reminderEnabled: boolean = false;
  reminderDate: any = null;
  picture: String = null;

  links: Link[] = new Array<Link>();
  tasks: ChecklistItem[] = new Array<ChecklistItem>();
  list: List;


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

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public asCtrl: ActionSheetController, private camera: Camera, private alertCtrl: AlertController, private iab: InAppBrowser, private browserTab: BrowserTab, public sm: StorageManager, public viewCtrl: ViewController, public settings: UserSettings) {
    this.list = navParams.get('list');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewItemPage');
  }

  async createItem() {
    if ((this.title == null || this.title == "") && this.picture == null && this.textContent == null) {
      this.translate.get("Error").toPromise().then(async err => {
        this.translate.get("Please fill at least one input").toPromise().then(async msg => {
          let alert = this.alertCtrl.create({
            title: err,
            subTitle: msg,
            buttons: ['OK']
          });
          alert.present();
        });
      });
    } else {
      let item: ListItem = new ListItem();
      item.id = UuidGenerator.getUUID();
      item.title = this.title;
      item.picture = this.picture;
      item.textContent = this.textContent;
      item.creationDate = Date.now();
      item.lastEditionDate = Date.now();
      item.list = this.list;
      item.reminderDate = this.reminderDate;
      item.links = this.links;
      item.firebaseId = "NOTAPPLICABLE";
      this.list.items.push(item);

      if (this.list.isSynchronized) {
        await this.sm.addSyncedItem(item);
      } else {
        for (let link of this.links) {
          link.item = item;
          await this.sm.saveLink(link);
        }
        await this.sm.saveListItem(item);
      }

      console.log("Saving new item...");
      console.log(this.list);
      await this.sm.saveLocalList(this.list);
      await this.sm.getAll();
      this.viewCtrl.dismiss({'list': this.list});
    }
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
                          console.log(this.picture);
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
                          console.log(this.picture);
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
    this.translate.get('New Link').toPromise().then( title => {
      this.translate.get('Link').toPromise().then( placeholder => {
        this.translate.get('Cancel').toPromise().then( cancel => {
          this.translate.get('Add').toPromise().then( add => {
            let alert = this.alertCtrl.create({
              title: title,
              inputs: [
                {
                  name: 'content',
                  placeholder: placeholder,
                  type: 'url'
                }
              ],
              buttons: [
                {
                  text: cancel,
                  role: 'cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: add,
                  handler: data => {
                    let link: Link = new Link();
                    link.content = data.content;
                    this.links.push(link);
                  }
                }
              ]
            });
            alert.present();
          });
        });
      });
    });
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
    } else {
      return "link";
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

  createTask() {
    this.translate.get('New Task').toPromise().then( title => {
      this.translate.get('Text').toPromise().then( placeholder => {
        this.translate.get('Cancel').toPromise().then( cancel => {
          this.translate.get('Add').toPromise().then( add => {
            let alert = this.alertCtrl.create({
              title: title,
              inputs: [
                {
                  name: 'content',
                  placeholder: placeholder,
                  type: 'url'
                }
              ],
              buttons: [
                {
                  text: cancel,
                  role: 'cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: add,
                  handler: data => {
                    let task: ChecklistItem = new ChecklistItem();
                    task.text = data.content;
                    this.tasks.push(task);
                  }
                }
              ]
            });
            alert.present();
          });
        });
      });
    });
  }

  deleteLink(link: Link) {
    let index = this.links.indexOf(link, 0);
    if (index > -1) {
      this.links.splice(index, 1);
    }
  }

  deleteTask(task: ChecklistItem) {
    let index = this.tasks.indexOf(task, 0);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
  }
}
