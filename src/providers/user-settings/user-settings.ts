import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable()
export class UserSettings {

  public isConnected:boolean = false;
  public user:firebase.User;

  constructor() {
  }

}
