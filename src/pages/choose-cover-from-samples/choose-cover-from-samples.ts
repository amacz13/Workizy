import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';
import {UserSettings} from "../../providers/user-settings/user-settings";

@Component({
  selector: 'page-choose-cover-from-samples',
  templateUrl: 'choose-cover-from-samples.html',
})
export class ChooseCoverFromSamplesPage {
  public imgList: Array<String> = ["00.jpg","01.jpg","02.jpg","03.jpg","04.jpg","05.jpg","06.jpg","07.jpg","08.jpg","09.jpg","mountains.jpg","flowers.jpg"];

  constructor(public viewCtrl: ViewController, public settings: UserSettings) {
  }

  /**
   * Choose Picture
   * @param {string} img  The image choosed by the user
   */
  choose(img: String) {
    //Close the view and transfer the chosen picture
    this.viewCtrl.dismiss({'picture':img});
  }

  /**
   * Close Page
   */
  close() {
    //Close the view
    this.viewCtrl.dismiss();
  }
}
