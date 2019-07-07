import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform, Slides} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {UserSettings} from "../../providers/user-settings/user-settings";
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";
import * as firebase from 'firebase/app';
import {AngularFirestore} from "@angular/fire/firestore";
import Persistence = firebase.auth.Auth.Persistence;
import {AngularFireAuth} from "@angular/fire/auth";
import {TranslateService} from "@ngx-translate/core";
import {MyApp} from "../../app/app.component";
import {BrowserTab} from "@ionic-native/browser-tab";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {StatusbarManager} from "../../providers/statusbar-manager/statusbar-manager";
import {LocalStorage} from "../../providers/local-storage/local-storage";

@IonicPage()
@Component({
  selector: 'page-first-start',
  templateUrl: 'first-start.html',
})
export class FirstStartPage {

  @ViewChild(Slides) slides: Slides;
  /**
   * Email typed by the user
   */
  email: string = "";
  /**
   * Password typed by the user
   */
  password: string = "";
  backEnabled : boolean = false;
  accountExists : boolean = false;
  userName: any;

  get os() {
    return MyApp.os;
  }

  constructor(private storage: LocalStorage, public navCtrl: NavController, public auth: AngularFireAuth, private browserTab: BrowserTab, private iab: InAppBrowser, public navParams: NavParams, public platform: Platform, public settings: UserSettings, public loadingCtrl: LoadingController, public fm: FirebaseManager, public alertCtrl: AlertController, public translate: TranslateService, public afs:AngularFirestore, public ln: LocalNotifications, public sb: StatusbarManager) {
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

      storage.get('firstStart').then((val) => {
        if (val == 1) {
          // Not first start, init app
          storage.get('connected')
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
      });
      this.storage.get('accentColor').then(value => {
        this.settings.accentColor = value
      });

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
    this.backEnabled = true;
  }


  back() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
    console.log(this.slides.getActiveIndex());
    if(this.slides.getActiveIndex() == 0) {
      this.backEnabled = false;
    }
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
                    this.storage.set('connected', 0).then(() => {
                      this.storage.set('firstStart', 1).then(() => {
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

  openCluf() {

    console.log("Opening EULA...");

    if (MyApp.os == "osx") {
      console.log("Trying to open EULA in system browser...");
      const browser = this.iab.create("https://blog.amacz13.fr/workizy-cluf/","_system");
    } else if (MyApp.os == "windows") {
      const browser = this.iab.create("https://blog.amacz13.fr/workizy-cluf/");
    } else {
      this.browserTab.isAvailable().then(isAvailable => {
        this.browserTab.openUrl("https://blog.amacz13.fr/workizy-cluf/");
      }).catch(() => {
        console.log(MyApp.os);
        const browser = this.iab.create("https://blog.amacz13.fr/workizy-cluf/");
      });
    }
  }

  askPassword() {
    if (this.email == "" || this.email == null){
      // Some fields are empty, showing an error
      this.translate.get("Error").toPromise().then(async err => {
        this.translate.get("Please type your email first").toPromise().then(async msg => {
          let alert = this.alertCtrl.create({
            title: err,
            subTitle: msg,
            buttons: ['OK']
          });
          alert.present();
        });
      });
    } else {
      this.translate.get("Please wait...").toPromise().then(async msg => {
        let loading = this.loadingCtrl.create({
          content: msg
        });

        loading.present();
        firebase.auth().fetchSignInMethodsForEmail(this.email).then(val => {
          this.accountExists = val.length != 0;
          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          loading.dismissAll();
        }).catch(err => {
          console.log(err);
        });
      });
    }
  }

  doLoginOrRegister() {
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
      if (this.accountExists){
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
                  this.storage.set('connected', 1) .then(() => {
                      this.storage.set('user', val2.user.toJSON().toString()).then(() => {
                        this.storage.set('firstStart', 1).then( async() => {
                          this.settings.user = val2.user;
                          this.settings.isConnected = true;
                          await this.fm.sync().then(async () => {
                            await MyApp.storageManager.getAll();
                            await loading.dismiss();
                            // Showing HomePage
                            //this.navCtrl.setRoot(TabsPage).then(() => loading.dismissAll());
                            if (this.settings.user.displayName == null) {
                              this.next();
                            } else {
                              await this.goToHomePage();
                            }
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
      } else {
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
                  this.storage.set('connected', 1).then(() => {
                    this.storage.set('user', val2.user).then(() => {
                      this.storage.set('firstStart', 1).then(async () => {
                        this.settings.user = val2.user;
                        this.settings.isConnected = true;
                        await this.fm.sync().then(async () => {
                          await MyApp.storageManager.getAll();
                          await loading.dismiss();
                          // Showing HomePage
                          //this.navCtrl.setRoot(TabsPage).then(() => loading.dismissAll());
                          this.next();
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
  }

  goToHomePage(){
    this.navCtrl.setRoot(TabsPage);
  }

  setDisplayName() {
    this.settings.user.updateProfile({displayName : this.userName}).then(val => {
      console.log(val);
      this.storage.set('user', firebase.auth().currentUser).then(() => {
        this.goToHomePage();
      });
    });
  }
}
