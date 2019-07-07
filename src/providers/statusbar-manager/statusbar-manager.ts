import { Injectable } from '@angular/core';
import {StatusBar} from "@ionic-native/status-bar";
import {MyApp} from "../../app/app.component";

@Injectable()
export class StatusbarManager {

  constructor(public statusbar: StatusBar) {
  }

  setStatusBarColor(accentColor:string){
    if (MyApp.os != "osx" && MyApp.os != "browser"){
      switch (accentColor) {
        case "primary":
          this.statusbar.backgroundColorByHexString("#488aff");
          break;
        case "amber":
          this.statusbar.backgroundColorByHexString("#ffc107");
          break;
        case "teal":
          this.statusbar.backgroundColorByHexString("#009688");
          break;
        case "red":
          this.statusbar.backgroundColorByHexString("#f44336");
          break;
        case "pink":
          this.statusbar.backgroundColorByHexString("#e91e63");
          break;
        case "purple":
          this.statusbar.backgroundColorByHexString("#9c27b0");
          break;
        case "cyan":
          this.statusbar.backgroundColorByHexString("#00bcd4");
          break;
        case "green":
          this.statusbar.backgroundColorByHexString("#4caf50");
          break;
        case "orange":
          this.statusbar.backgroundColorByHexString("#ff9800");
          break;
        case "brown":
          this.statusbar.backgroundColorByHexString("#795548");
          break;
      }
    }
  }
}
