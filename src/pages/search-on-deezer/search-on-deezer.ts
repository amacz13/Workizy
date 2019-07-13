import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UserSettings} from "../../providers/user-settings/user-settings";
import {HTTP} from "@ionic-native/http";
import {DeezerSong} from "../../providers/deezer-song/deezer-song";
import {HttpClient} from "@angular/common/http";
import {MyApp} from "../../app/app.component";

@IonicPage()
@Component({
  selector: 'page-search-on-deezer',
  templateUrl: 'search-on-deezer.html',
})
export class SearchOnDeezerPage {

  public list: Array<DeezerSong> = new Array<DeezerSong>();
  searchval: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public settings: UserSettings, public http: HTTP, public httpc: HttpClient, public alertCtrl: AlertController, public viewCtrl: ViewController) {
  }

  close() {
    this.navCtrl.pop();
  }

  search(value: string) {
    console.log("Searching Deezer for : "+value);
    this.list = new Array<DeezerSong>();
    if (MyApp.os == "android" || MyApp.os == "ios") {
      this.http.get("https://api.deezer.com/search?q=" + value, {}, {'Content-Type': 'application/json'}).then(data => {
        //nbResp = data['total'];
        //console.log(data);
        for (let element of JSON.parse(data.data)['data']) {
          //console.log(element);
          let song: DeezerSong = new DeezerSong(element.title, element.artist.name, element.preview, element.album.cover_medium);
          this.list.push(song);
        }
      }, err => {
        console.error("Error while seraching for songs on Deezer : ", err);
      });
    } else {
      this.httpc.get("https://api.deezer.com/search?q=" + value).toPromise().then(data => {
        //nbResp = data['total'];
        for (let element of data['data']) {
          //console.log(element);
          let song: DeezerSong = new DeezerSong(element.title, element.artist.name, element.preview, element.album.cover_medium);
          this.list.push(song);
        }
      }, err => {
        console.error("Error while seraching for songs on Deezer : ", err);
      });
    }
  }

  select(track: DeezerSong) {
    let alert = this.alertCtrl.create({
      title: "Autofill",
      message: "Do you want to fill automagically all the fields of the item with song's informations ?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: "No",
          handler: () => {
            console.log('No clicked');
            this.viewCtrl.dismiss({'track':track,"autofill":false});
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log('Yes clicked');
            this.viewCtrl.dismiss({'track':track,"autofill":true});
          }
        }
      ]
    });
    alert.present();
  }
}
