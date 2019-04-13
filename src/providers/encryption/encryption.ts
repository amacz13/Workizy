import { Injectable } from '@angular/core';
import {AES256} from "@ionic-native/aes-256";
import {NativeStorage} from "@ionic-native/native-storage";
import {Device} from "@ionic-native/device";
import {Platform} from "ionic-angular";

@Injectable()
export class Encryption {

  private secureKey:string;
  private secureIV:string;

  constructor(private nativeStorage: NativeStorage, private aes256: AES256, private device: Device, private platform: Platform) {
    this.platform.ready().then(() => {
      this.nativeStorage.getItem("secureKey").then((value) => {
        console.log("[Encryption] Secret key already exists...");
        this.secureKey = value;
      }).catch((error) => {
        this.aes256.generateSecureKey(this.device.uuid).then((value) => {
          console.log("[Encryption] Secret key doesn't exists, generating a new one : "+error);
          this.secureKey = value;
          this.nativeStorage.setItem("secureKey", this.secureKey).then( () => console.log("[Encryption] Secret key has been generated : "+this.secureKey)).catch( err => console.error("[Encryption] Secret key has not been generated : "+err));
        }).catch( err => console.error("[Encryption] An error occured during Secret Key generation : "+err));
      });
      this.nativeStorage.getItem("secureIV").then((value) => {
        console.log("[Encryption] Secret IV already exists...");
        this.secureIV = value;
      }).catch((error) => {
        console.log("[Encryption] Secret IV doesn't exists, generating a new one : "+error);
        this.aes256.generateSecureIV(this.device.uuid).then((value) => {
          this.secureIV = value;
          this.nativeStorage.setItem("secureIV", this.secureIV);
        }).catch( err => console.error("[Encryption] An error occured during Secret IV generation : "+err));
      });
    });
  }

}
