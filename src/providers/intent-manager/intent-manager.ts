import { Injectable } from '@angular/core';
import {Intent} from "@ionic-native/web-intent";
import {ListItem} from "../list-item/list-item";
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
import {HTTP} from "@ionic-native/http";
import {AlertController} from "ionic-angular";
import {StorageManager} from "../storage-manager/storage-manager";

@Injectable()
export class IntentManager {

  constructor(public file: File, public filePath: FilePath, public http: HTTP, public alertCtrl: AlertController, public sm: StorageManager) {

  }

  analyseIntent(intent: Intent){
    if (intent.action == "android.intent.action.SEND") {
      let item: ListItem = new ListItem();
      if (intent.type == "image/jpeg") {
        if (intent.extras["android.intent.extra.STREAM"] != null) {
          console.log("Picture : ", intent.extras["android.intent.extra.STREAM"]);

          this.filePath.resolveNativePath(intent.extras["android.intent.extra.STREAM"]).then(fileUri => {
            console.log("File URI : ", fileUri);
            let fileURL = fileUri.split("/");
            let path = "";
            for (let i = 0; i < fileURL.length - 1; i++) {
              path += fileURL[i] + "/";
            }
            let fileName = fileURL[fileURL.length - 1];
            console.log("Path : ", path);
            console.log("File : ", fileName);
            this.file.readAsDataURL(path, fileName).then(base64 => {
              console.log("Picture base64 : ", base64);
            }).catch(err => console.error("Error while fetching picture : ", err));

          }).catch(error => console.error("Error while converting picture uri : ", error));

        }
        if (intent.extras["android.intent.extra.SUBJECT"] != null) {
          console.log("Title : ", intent.extras["android.intent.extra.SUBJECT"]);
        }
        if (intent.extras["android.intent.extra.TEXT"] != null) {
          console.log("Text : ", intent.extras["android.intent.extra.TEXT"]);
        }
      } else if (intent.type == "text/plain") {
        if (intent.extras["android.intent.extra.SUBJECT"] != null && intent.extras["android.intent.extra.TEXT"] != null) {
          let subject: string = intent.extras["android.intent.extra.SUBJECT"];
          let text: string = intent.extras["android.intent.extra.TEXT"];
          if (text.includes("http://www.deezer.com")) {
            console.log("Catching Share infos from Deezer App");
            let url = "https://api.deezer.com/2.0/search?q=" + subject;
            console.log(url);
            this.http.get(url, {}, {'Content-Type': 'application/json'}).then(data => {
              console.log("Deezer API Result : ", JSON.parse(data.data));
              console.log("Deezer Preview URL : ", JSON.parse(data.data)['data'][0].preview);
              this.createDeezerItem(JSON.parse(data.data)['data'][0]);
            }).catch(err => console.error("Error while loading Title from Deezer : ", err));
          }
        } else if (intent.extras["android.intent.extra.TEXT"] != null) {
          let text: string = intent.extras["android.intent.extra.TEXT"];

        }
      }
    } else if (intent.action == "android.intent.action.RUN") {
      if (intent.extras["android.intent.extra.SUBJECT"] == "QUICK_NEW_ITEM") {
        console.log("Quick New Item !");
      }
    }
  }

  private createDeezerItem(preview: any) {
    let prompt = this.alertCtrl.create({
      title: 'Add to a list',
      message: 'Select a list',
      inputs : [],
      buttons : [
        {
          text: "Cancel",
          handler: data => {
            console.log("cancel clicked");
          }
        },
        {
          text: "New List",
          handler: data => {
            console.log("New List clicked");
          }
        },
        {
          text: "Add",
          handler: data => {
            console.log("Add clicked");
          }
        }]});
    for (let l of this.sm.allLists) {
      prompt.addInput({
        type:'radio',
        label:l.title.toString(),
        value:l.id.toString()
      });
    }
    prompt.present();
  }

}
