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
import {MyApp} from "../../app/app.component";

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
    // Define application language
    translate.use(translate.getBrowserLang());
    // Cordova plugins & platform ready
    this.platform.ready().then( () => {

      // Customize the slider
      this.slides.lockSwipes(true);
      this.slides.pager = true;
      this.slides.paginationType = "progress";
      this.slides.paginationHide = false;

      // Check device os
      if (this.platform.is('android')) {
        // Do specific android stuff
        console.log('I am an android device!');
      }

      // Check if this is the first start of the app
      console.log("[Login] Platform ready, accessing Native Storage...");
      this.nativeStorage.getItem('firstStart').then( val => {
        if (val == 1){
          // Not first start, init app
          this.nativeStorage.getItem('connected')
            .then(data => {
                if (data == 1) {
                  // User already authenticated, loading home page and retrieving online lists
                  this.settings.isConnected = true;
                  this.navCtrl.setRoot(TabsPage);
                  this.translate.get("Please wait...").toPromise().then(async text => {
                    let loading = this.loadingCtrl.create({
                      content: text
                    });
                    loading.present().then(async () => {
                      await this.fm.sync().then(async () => {
                        await MyApp.storageManager.getAll();
                        await loading.dismiss();
                      });
                    });
                  });
                } else {
                  // User not authenticated, loading home page
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

  // Go to the next page of the slider
  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  // Refuse EULA, close the app
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

  // Go to registration page
  register() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  // Go to login page
  login() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(this.slides.getActiveIndex()+2);
    this.slides.lockSwipes(true);
  }

  // Start the app without an account
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
                    // User agree to use the app without account, loading home page
                    this.nativeStorage.setItem('connected', 0).then(() => {
                      this.nativeStorage.setItem('firstStart', 1).then(() => {
                        this.settings.isConnected = false;
                        MyApp.storageManager.getAll();
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

  // Login function
  doLogin() {
    if (this.email == "" || this.email == null || this.password == "" || this.password == null){
      // Some fields are empty, showing an error
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
      // Displaying loader
      this.translate.get("Logging in...").toPromise().then(async msg => {
        let loading = this.loadingCtrl.create({
          content: msg
        });

        loading.present();

        // Auth request to Firebase
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(val => {
          // Credentials correct
          console.log("User connected : ", val);
          if (!val.user.emailVerified) {
            // Account not verified, send verification email
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
            // Account verfifed, sign in to Angular Firestore
            this.afs.firestore.app.auth().setPersistence(Persistence.SESSION).then(() => {
              this.afs.firestore.app.auth().signInWithEmailAndPassword(this.email, this.password).then(val2 => {
                console.log("UserID : "+val2.user.uid);

                // Storing values locally
                this.nativeStorage.setItem('connected', 1)
                  .then(() => {
                    this.nativeStorage.setItem('user', val2.user).then(() => {
                      this.nativeStorage.setItem('firstStart', 1).then( async() => {
                        this.settings.user = val2.user;
                        this.settings.isConnected = true;
                        await this.fm.sync().then(async () => {
                          await MyApp.storageManager.getAll();
                          await loading.dismiss();
                          // Showing HomePage
                          this.navCtrl.setRoot(TabsPage).then(() => loading.dismissAll());
                        });
                      });
                    });
                  });
              });
            });
          }
        }).catch(err => {
          // Error while logging in the user, may be bad credentials...
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

  // Register function
  doRegister() {
    if (this.email == "" || this.email == null || this.password == "" || this.password == null){
      // Some fields are empty, showing an error
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
      // Displaying loader
      this.translate.get("Signing in...").toPromise().then(async msg => {
        let loading = this.loadingCtrl.create({
          content: msg
        });

        loading.present();
        // Firebase Register Request
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(val => {
          console.log("User registered : ", val);
          if (!val.user.emailVerified) {
            // Account not verified, sending verification email
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
            // Account verified, auth request to Angular Firestore
            this.afs.firestore.app.auth().setPersistence(Persistence.SESSION).then(() => {
              this.afs.firestore.app.auth().signInWithEmailAndPassword(this.email, this.password).then(val2 => {
                this.nativeStorage.setItem('connected', 1)
                  .then(() => {
                    this.nativeStorage.setItem('user', val2.user).then(() => {
                      this.nativeStorage.setItem('firstStart', 1).then(async () => {
                        this.settings.user = val2.user;
                        this.settings.isConnected = true;
                        await this.fm.sync().then(async () => {
                          await MyApp.storageManager.getAll();
                          await loading.dismiss();
                          // Showing HomePage
                          this.navCtrl.setRoot(TabsPage).then(() => loading.dismissAll());
                        });
                      });
                    });
                  });
              });
            });
          }
        }).catch(err => {
          // Can't register user, maybe the email is already registered
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

  // Password reset
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
