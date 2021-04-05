import { Component } from '@angular/core';
import { Parse } from 'parse';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.initParse();
    this.translate.use(this.translate.getBrowserLang());
  }

  initParse() {
    Parse.initialize('WORKIZY');
    Parse.serverURL = 'http://193.168.147.167:1337/parse'
  }
}
