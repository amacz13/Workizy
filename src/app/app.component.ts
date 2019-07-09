import { Component } from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { createConnection } from 'typeorm';
import {List} from "../providers/list/list";
import {StorageManager} from "../providers/storage-manager/storage-manager";
import {ListItem} from "../providers/list-item/list-item";
import {ChecklistItem} from "../providers/checklist-item/checklist-item";
import {Link} from "../providers/link/link";
import {FirstStartPage} from "../pages/first-start/first-start";
import { WebIntent } from '@ionic-native/web-intent';
import {Device} from "@ionic-native/device";
import {LocalStorage} from "../providers/local-storage/local-storage";
import {TranslateService} from "@ngx-translate/core";
import { File } from '@ionic-native/file';
import {FilePath} from "@ionic-native/file-path";
import { HTTP } from '@ionic-native/http';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = FirstStartPage;
  theme:string = "light-theme";

  public static storageManager:StorageManager;
  public static internetConnected: boolean = navigator.onLine;
  public static os: string;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, sm: StorageManager, event: Events, webIntent: WebIntent, device: Device, storage: LocalStorage, translate: TranslateService, file: File, filePath: FilePath, http: HTTP) {
    MyApp.storageManager = sm;
    // Device is ready, Cordova plugins & Ionic modules are loaded
    platform.ready().then(async() => {
      // Define application language
      translate.use(translate.getBrowserLang());
      if (device.platform == "Android") {
        console.log("Platform : Android");
        MyApp.os = "android";
        webIntent.getIntent().then((data) => {
            console.log('Intent OK', data);
            if (data.action == "android.intent.action.SEND"){
              let item: ListItem = new ListItem();
              if (data.type == "image/jpeg") {
                if (data.extras["android.intent.extra.STREAM"] != null) {
                  console.log("Picture : ", data.extras["android.intent.extra.STREAM"]);

                  filePath.resolveNativePath(data.extras["android.intent.extra.STREAM"]).then( fileUri => {
                    console.log("File URI : ",fileUri);
                    let fileURL = fileUri.split("/");
                    let path = "";
                    for (let i = 0; i < fileURL.length-1; i++){
                      path+= fileURL[i]+"/";
                    }
                    let fileName = fileURL[fileURL.length-1];
                    console.log("Path : ",path);
                    console.log("File : ",fileName);
                    file.readAsDataURL(path,fileName).then( base64 => {
                      console.log("Picture base64 : ",base64);
                    }).catch( err => console.error("Error while fetching picture : ",err));

                  }).catch(error => console.error("Error while converting picture uri : ",error));

                }
                if (data.extras["android.intent.extra.SUBJECT"] != null) {
                  console.log("Title : ", data.extras["android.intent.extra.SUBJECT"]);
                }
                if (data.extras["android.intent.extra.TEXT"] != null) {
                  console.log("Text : ", data.extras["android.intent.extra.TEXT"]);
                }
              } else if (data.type == "text/plain") {
                if (data.extras["android.intent.extra.SUBJECT"] != null && data.extras["android.intent.extra.TEXT"] != null) {
                  let subject: string = data.extras["android.intent.extra.SUBJECT"];
                  let text: string = data.extras["android.intent.extra.TEXT"];
                  if (text.includes("http://www.deezer.com")){
                    console.log("Catching Share infos from Deezer App");
                    let url = "https://api.deezer.com/2.0/search?q="+subject;
                    console.log(url);
                    http.get(url, {}, {'Content-Type': 'application/json'}).then( data => {
                      console.log("Deezer API Result : ",JSON.parse(data.data));
                      console.log("Deezer Preview URL : ",JSON.parse(data.data)['data'][0].preview);
                    }).catch( err => console.error("Error while loading Title from Deezer : ",err));
                  }
                } else if (data.extras["android.intent.extra.TEXT"] != null) {
                  let text: string = data.extras["android.intent.extra.TEXT"];

                }
              }
            } else if (data.action == "android.intent.action.RUN") {
              if (data.extras["android.intent.extra.SUBJECT"] == "QUICK_NEW_ITEM"){
                console.log("Quick New Item !");
              }
            }
            (<any>window).plugins.Shortcuts.supportsPinned(function(supported) {
              if (supported){
                throw translate.get('New Item').toPromise().then( label => {
                  let shortcut = {
                    id: 'quick_new_item',
                    shortLabel: label,
                    longLabel: label,
                    //iconBitmap: 'data:image/png;base64,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',
                    iconFromResource: "ic_shortcut_add",
                    intent: {
                      action: 'android.intent.action.RUN',
                      categories: [
                        'QUICKNEWITEM' // Built-in Android category
                      ],
                      flags: 67108864, // FLAG_ACTIVITY_CLEAR_TOP
                      data: 'workizy://quick-new-item', // Must be a well-formed URI
                      extras: {
                        'android.intent.extra.SUBJECT': 'QUICK_NEW_ITEM' // Built-in Android extra (string)
                      }
                    }
                  };
                  (<any>window).plugins.Shortcuts.setDynamic([shortcut], function() {
                    console.log('Shortcut created successfully');
                  }, function(error) {
                    console.error('Error while creating shortcut ' + error);
                  });
                });
              }
              else console.log("Android Shortcuts not supported in this version.")
            }, function(error) {
              console.error('Error while creating shortcut ' + error);
            });
          },
          err => {
            console.log('Intent Error', err);
          });
      } else if (device.platform == "iOS") {
        console.log("Platform : iOS");
        MyApp.os = "ios";
      } else if (device.platform == "Windows") {
        console.log("Platform : Windows");
        MyApp.os = "windows";
      } else if (device.platform == "Mac OS X") {
        console.log("Platform : macOS");
        MyApp.os = "osx";
      } else if (device.platform == "browser") {
        console.log("Platform : Electron / WebBrowser");
        MyApp.os = "browser";
      }

      storage.get('darkTheme').then(val => {
        if (val) {
          this.theme = "dark-theme";
        }
      });

      if(platform.is('cordova') && device.platform != "browser") {
        // Device is an app (Windows, MacOS, Android or iOS)
        console.log("[WhatsNext] Using cordova platform...");
        console.log("[WhatsNext] Creating ORM link with database...");
        // Creating connection to database
        await createConnection({
          type: 'cordova',
          database: 'workizy-devdb32',
          location: 'default',
          logging: ['error', 'query', 'schema'],
          synchronize: true,
          entities: [
            List,
            ListItem,
            ChecklistItem,
            Link
          ]
        }).then( connection => {
          sm.connection = connection;
          sm.initRepositories();
        });
      } else {
        console.log("[WhatsNext] Using web platform...");
        console.log("[WhatsNext] Creating ORM link with database...");
        await createConnection({
          type: 'sqljs',
          autoSave: true,
          location: 'browser',
          logging: ['error', 'query', 'schema'],
          synchronize: true,
          entities: [
            List,
            ListItem,
            ChecklistItem,
            Link
          ]
        }).then( () => {
          sm.initRepositories()
        });
      }
      // Hide the splashcreen and create the event listeners
      splashScreen.hide();
      event.subscribe('theme:dark', () => {
        this.setDarkTheme();
      });
      event.subscribe('theme:light', () => {
        this.setLightTheme();
      });
    });
  }

  private setDarkTheme() {
    this.theme = "dark-theme";
  }

  private setLightTheme() {
    this.theme = "light-theme";
  }
}
