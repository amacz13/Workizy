import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {NativeStorage} from "@ionic-native/native-storage";
import {MyApp} from "../../app/app.component";

@Injectable()
export class LocalStorage {

  constructor(public storage: Storage, public ns: NativeStorage) {

  }

  get(key: string) {
    if (MyApp.os != "browser") {
      return this.ns.getItem(key);
    } else {
      return this.storage.get(key);
    }
  }

  set(key: string, value: any){
    if (MyApp.os != "browser") {
      return this.ns.setItem(key,value);
    } else {
      return this.storage.set(key,value);
    }
  }

}
