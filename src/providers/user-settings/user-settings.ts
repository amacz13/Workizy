import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {NativeStorage} from "@ionic-native/native-storage";
import {Platform} from "ionic-angular";
import {MyApp} from "../../app/app.component";
import {Storage} from "@ionic/storage";

@Injectable()
export class UserSettings {

  public isConnected:boolean = false;
  public user:firebase.User;
  public accentColor: string = "primary";

  constructor(public storage: Storage, public ns: NativeStorage, public platform: Platform) {
    this.platform.ready().then( () => {
      console.log("[User Settings] Platform ready, accessing Native Storage...");
      if (MyApp.os != "browser") this.ns.getItem('user').then( (val => this.user = val));
      else this.storage.get('user').then( (val => this.user = val));
    });
  }

}
