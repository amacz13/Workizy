import { Injectable } from '@angular/core';
import {Link} from "../link/link";
import {BrowserTab} from "@ionic-native/browser-tab";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {MyApp} from "../../app/app.component";

@Injectable()
export class LinkUtils {

  constructor(public browserTab: BrowserTab, public iab: InAppBrowser) {
  }

  getIcon(link: Link) {
    if (link.content.includes("youtube.com") || link.content.includes("youtu.be")) {
      return "logo-youtube";
    } else if (link.content.includes("facebook.com") || link.content.includes("fb.me")){
      return "logo-facebook";
    } else if (link.content.includes("twitter.com") || link.content.includes("t.co")){
      return "logo-twitter";
    } else if (link.content.includes("twitch.com")){
      return "logo-twitch";
    } else if (link.content.includes("github.com")){
      return "logo-github";
    } else if (link.content.includes("instagram.com")){
      return "logo-instagram";
    } else if (link.content.includes("linkedin.com") || link.content.includes("linked.in")){
      return "logo-linkedin";
    } else if (link.content.includes("pinterest.com")){
      return "logo-pinterest";
    } else {
      return "link";
    }
  }

  openLink(content: String) {
    if (MyApp.os == "osx" || MyApp.os == "browser") {
      if (content.includes("http://") || content.includes("https://")){
        const browser = this.iab.create(content.toString(),"_system");
      } else {
        const browser = this.iab.create("https://"+content.toString(),"_system");
      }
    } else if (MyApp.os == "windows") {
      if (content.includes("http://") || content.includes("https://")){
        const browser = this.iab.create(content.toString());
      } else {
        const browser = this.iab.create("https://"+content.toString());
      }
    } else {
      this.browserTab.isAvailable().then(isAvailable => {
        if (content.includes("http://") || content.includes("https://")){
          this.browserTab.openUrl(content.toString());
        } else {
          this.browserTab.openUrl("https://"+content.toString());
        }
      }).catch(() => {
        if (content.includes("http://") || content.includes("https://")){
          const browser = this.iab.create(content.toString());
        } else {
          const browser = this.iab.create("https://"+content.toString());
        }
      });
    }
  }


}
