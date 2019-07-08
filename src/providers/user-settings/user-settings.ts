import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {Platform} from "ionic-angular";
import {LocalStorage} from "../local-storage/local-storage";


@Injectable()
export class UserSettings {

  public isConnected:boolean = false;
  public user:firebase.User;
  public accentColor: string = "primary";
  public theme: string = "light";
  public displayMode;

  constructor(public storage: LocalStorage, public platform: Platform) {
    this.platform.ready().then( () => {
      console.log("[User Settings] Platform ready, accessing Native Storage...");
      this.storage.get('user').then( (val => this.user = val));
    });
  }

}
