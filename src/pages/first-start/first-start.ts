import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform, Slides} from 'ionic-angular';
import {NativeStorage} from "@ionic-native/native-storage";
import {TabsPage} from "../tabs/tabs";
import {UserSettings} from "../../providers/user-settings/user-settings";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";
import * as firebase from 'firebase/app';
import {AngularFirestore} from "@angular/fire/firestore";
import Persistence = firebase.auth.Auth.Persistence;
import {AngularFireAuth} from "@angular/fire/auth";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the FirstStartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-first-start',
  templateUrl: 'first-start.html',
})
export class FirstStartPage {
  @ViewChild(Slides) slides: Slides;
  email: string = "";
  password: string = "";

  constructor(public navCtrl: NavController, public auth: AngularFireAuth, public navParams: NavParams, public platform: Platform, public nativeStorage: NativeStorage, public settings: UserSettings, public loadingCtrl: LoadingController, public fm: FirebaseManager, public alertCtrl: AlertController, public translate: TranslateService, public afs:AngularFirestore) {
    translate.use(translate.getBrowserLang());
    this.platform.ready().then( () => {
      this.slides.lockSwipes(true);
      this.slides.pager = true;
      this.slides.paginationType = "progress";
      this.slides.paginationHide = false;
      //this.slides.effect = "coverflow";
      console.log("[Login] Platform ready, accessing Native Storage...");
      if (this.platform.is('android')) {
        // Do specific android stuff
        console.log('I am an android device!');
      }
      this.nativeStorage.getItem('firstStart').then( val => {
        if (val == 1){
          // Not first start, init app
          this.nativeStorage.getItem('connected')
            .then(data => {
                if (data == 1) {
                  this.settings.isConnected = true;
                  this.navCtrl.setRoot(TabsPage);
                  this.translate.get("Please wait...").toPromise().then(async text => {
                    let loading = this.loadingCtrl.create({
                      content: text
                    });
                    loading.present().then(async () => {
                      await this.fm.sync().then(async () => await loading.dismiss());
                    });
                  });
                } else {
                  this.settings.isConnected = false;
                  this.navCtrl.setRoot(TabsPage);
                }
              },
              error => console.error(error)
            );
        }
      })
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirstStartPage');
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  refuse() {
    this.translate.get("EULA Refused").toPromise().then(async title => {
      this.translate.get("The application will exit").toPromise().then(async msg => {
        let alert = this.alertCtrl.create({
          title: title,
          subTitle: msg,
          buttons: [
            {
              text:'OK',
              handler: () => {
                this.platform.exitApp();
              }
            }
            ]
        });
        alert.present();
      });
    });
  }

  register() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  login() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(this.slides.getActiveIndex()+2);
    this.slides.lockSwipes(true);
  }

  noAccount() {
    this.translate.get("Continue without account").toPromise().then(async title => {
      this.translate.get("Without an account, you won't be able to use all functions of the app").toPromise().then(async msg => {
        this.translate.get("Cancel").toPromise().then(async cancel => {
          this.translate.get("Continue").toPromise().then(async cont => {
            let alert = this.alertCtrl.create({
              title: title,
              message: msg,
              buttons: [
                {
                  text: cancel,
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: cont,
                  handler: () => {
                    this.nativeStorage.setItem('connected', 0).then(() => {
                      this.nativeStorage.setItem('firstStart', 1).then(() => {
                        this.settings.isConnected = false;
                        this.navCtrl.setRoot(TabsPage);
                      });
                    });
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

  doLogin() {
    if (this.email == "" || this.email == null || this.password == "" || this.password == null){
      this.translate.get("Error").toPromise().then(async err => {
        this.translate.get("Please fill all inputs").toPromise().then(async msg => {
          let alert = this.alertCtrl.create({
            title: err,
            subTitle: msg,
            buttons: ['OK']
          });
          alert.present();
        });
      });
    } else {
      this.translate.get("Logging in...").toPromise().then(async msg => {
        let loading = this.loadingCtrl.create({
          content: msg
        });

        loading.present();

        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(val => {
          console.log("User connected : ", val);
          if (!val.user.emailVerified) {
            firebase.auth().currentUser.sendEmailVerification().then( () => {
              loading.dismissAll();
              this.translate.get("Verify email").toPromise().then(async title => {
                this.translate.get("Please verify your account by clicking on the link you received by email").toPromise().then(async msg2 => {
                  let alert = this.alertCtrl.create({
                    title: title,
                    subTitle: msg2,
                    buttons: ['OK']
                  });
                  alert.present();
                });
              });
            });
          } else {
            this.afs.firestore.app.auth().setPersistence(Persistence.SESSION).then(() => {
              this.afs.firestore.app.auth().signInWithEmailAndPassword(this.email, this.password).then(val2 => {
                console.log("UserID : "+val2.user.uid);
                this.nativeStorage.setItem('connected', 1)
                  .then(() => {
                    this.nativeStorage.setItem('user', val2.user).then(() => {
                      this.nativeStorage.setItem('firstStart', 1).then(() => {
                        this.settings.user = val2.user;
                        this.settings.isConnected = true;
                        this.navCtrl.setRoot(TabsPage).then(() => loading.dismissAll());
                      });
                    });
                  });
              });
            });
          }
        }).catch(err => {
          console.error("Error while logging in user : ", err);
          loading.dismissAll();
          this.translate.get("Error").toPromise().then(async title => {
            let alert = this.alertCtrl.create({
              title: title,
              subTitle: err.message,
              buttons: ['OK']
            });
            alert.present();
          });
        });
      });
    }
  }

  doRegister() {
    if (this.email == "" || this.email == null || this.password == "" || this.password == null){
      this.translate.get("Error").toPromise().then(async err => {
        this.translate.get("Please fill all inputs").toPromise().then(async msg => {
          let alert = this.alertCtrl.create({
            title: err,
            subTitle: msg,
            buttons: ['OK']
          });
          alert.present();
        });
      });
    } else {
      this.translate.get("Signing in...").toPromise().then(async msg => {
        let loading = this.loadingCtrl.create({
          content: msg
        });

        loading.present();

        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(val => {
          console.log("User registered : ", val);
          if (!val.user.emailVerified) {
            firebase.auth().currentUser.sendEmailVerification().then(() => {
              loading.dismissAll();
              this.translate.get("Verify email").toPromise().then(async title => {
                this.translate.get("Please verify your account by clicking on the link you received by email").toPromise().then(async msg2 => {
                  let alert = this.alertCtrl.create({
                    title: title,
                    subTitle: msg2,
                    buttons: ['OK']
                  });
                  alert.present();
                });
              });
            });
          } else {
            this.afs.firestore.app.auth().setPersistence(Persistence.SESSION).then(() => {
              this.afs.firestore.app.auth().signInWithEmailAndPassword(this.email, this.password).then(val2 => {
                this.nativeStorage.setItem('connected', 1)
                  .then(() => {
                    this.nativeStorage.setItem('user', val2.user).then(() => {
                      this.nativeStorage.setItem('firstStart', 1).then(() => {
                        this.settings.user = val2.user;
                        this.settings.isConnected = true;
                        this.navCtrl.setRoot(TabsPage).then(() => loading.dismissAll());
                      });
                    });
                  });
              });
            });
          }
        }).catch(err => {
          console.error("Error while logging in user : ", err);
          loading.dismissAll();
          this.translate.get("Error").toPromise().then(async title => {
            let alert = this.alertCtrl.create({
              title: title,
              subTitle: err.message,
              buttons: ['OK']
            });
            alert.present();
          });
        });
      });
    }
  }

  passwordReset() {
    console.log("Password reset for",this.email);
    if (this.email == "" || this.email == null){
      this.translate.get("Error").toPromise().then(async title => {
        this.translate.get("Please type your email first").toPromise().then(async msg => {
          let alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: ['OK']
          });
          alert.present();
        });
      });
    } else {
      this.auth.auth.sendPasswordResetEmail(this.email).then( () => {
        this.translate.get("Reset Password").toPromise().then(async title => {
          this.translate.get("You will receive a link to reset your password by email").toPromise().then(async msg => {
            let alert = this.alertCtrl.create({
              title: title,
              subTitle: msg,
              buttons: ['OK']
            });
            alert.present();
          });
        });
      });
    }
  }
}
