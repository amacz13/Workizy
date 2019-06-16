import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import * as firebase from 'firebase/app';
import {TabsPage} from "../tabs/tabs";
import {AngularFireAuth} from "@angular/fire/auth";
import {NativeStorage} from "@ionic-native/native-storage";
import {UserSettings} from "../../providers/user-settings/user-settings";
import {AngularFirestore} from "@angular/fire/firestore";
import Persistence = firebase.auth.Auth.Persistence;
import {FirebaseManager} from "../../providers/firebase-manager/firebase-manager";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string;
  password: string;

  constructor(public navCtrl: NavController, public translate: TranslateService, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public auth: AngularFireAuth, private nativeStorage: NativeStorage, public settings: UserSettings, public platform: Platform, public afs: AngularFirestore, public fm:FirebaseManager) {
    this.platform.ready().then( () => {
      console.log("[Login] Platform ready, accessing Native Storage...");
      this.nativeStorage.getItem('connected')
        .then(
          data => {
            if (data == 1) {
              this.settings.isConnected = true;
              this.navCtrl.setRoot(TabsPage);
              let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present().then(async ()=> {
                await this.fm.sync().then(async () => await loading.dismiss());
              });
            }
          },
          error => console.error(error)
        );
    });
  }

  login() {
    if (this.email == "" || this.email == null || this.password == "" || this.password == null){
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please fill all inputs',
        buttons: ['OK']
      });
      alert.present();
    } else {
      let loading = this.loadingCtrl.create({
        content: 'Logging in...'
      });

      loading.present();

      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(val => {
        console.log("User connected : ", val);
        if (!val.user.emailVerified) {
          firebase.auth().currentUser.sendEmailVerification().then( () => {
            loading.dismissAll();
            let alert = this.alertCtrl.create({
              title: 'Verify email',
              subTitle: "Please verify your email address by clicking on the link you received by email",
              buttons: ['OK']
            });
            alert.present();
          });
        } else {
          this.afs.firestore.app.auth().setPersistence(Persistence.SESSION).then(() => {
            this.afs.firestore.app.auth().signInWithEmailAndPassword(this.email, this.password).then(val2 => {
              console.log("UserID : "+val2.user.uid);
              this.nativeStorage.setItem('connected', 1)
                .then(() => {
                  this.nativeStorage.setItem('user', val2.user).then(() => {
                    this.settings.user = val2.user;
                    this.settings.isConnected = true;
                    this.navCtrl.setRoot(TabsPage).then(() => loading.dismissAll());
                  });
                });
            });
          });
        }
      }).catch(err => {
        console.error("Error while logging in user : ", err);
        loading.dismissAll();
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err.message,
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }

  register() {
    if (this.email == "" || this.email == null || this.password == "" || this.password == null){
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please fill all inputs',
        buttons: ['OK']
      });
      alert.present();
    } else {

      let loading = this.loadingCtrl.create({
        content: 'Signing in...'
      });

      loading.present();

      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(val => {
        console.log("User registered : ", val);
        if (!val.user.emailVerified) {
          firebase.auth().currentUser.sendEmailVerification().then( () => {
            loading.dismissAll();
            let alert = this.alertCtrl.create({
              title: 'Verify email',
              subTitle: "Please verify your email address by clicking on the link you received by email",
              buttons: ['OK']
            });
            alert.present();
          });
        } else {
          this.afs.firestore.app.auth().setPersistence(Persistence.SESSION).then(() => {
            this.afs.firestore.app.auth().signInWithEmailAndPassword(this.email, this.password).then(val2 => {
              this.nativeStorage.setItem('connected', 1)
                .then(() => {
                  this.nativeStorage.setItem('user', val2.user).then(() => {
                    this.settings.user = val2.user;
                    this.settings.isConnected = true;
                    this.navCtrl.setRoot(TabsPage).then(() => loading.dismissAll());
                  });
                });
            });
          });
        }
      }).catch(err => {
        console.error("Error while logging in user : ", err);
        loading.dismissAll();
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err.message,
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }
}
