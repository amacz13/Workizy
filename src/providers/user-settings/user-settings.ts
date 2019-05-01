import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {NativeStorage} from "@ionic-native/native-storage";
import {Platform} from "ionic-angular";

@Injectable()
export class UserSettings {

  public isConnected:boolean = false;
  public user:firebase.User;

  constructor(public ns: NativeStorage, public platform: Platform) {
    this.platform.ready().then( () => {
      console.log("[User Settings] Platform ready, accessing Native Storage...");
      this.ns.getItem('user').then( (val => this.user = val));
    });
  }

}
