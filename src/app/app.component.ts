import { Component } from '@angular/core';
import { Parse } from 'parse';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.initParse();
  }

  initParse() {
    Parse.initialize('WORKIZY');
    Parse.serverURL = 'http://193.168.147.167:1337/parse'
  }
}
