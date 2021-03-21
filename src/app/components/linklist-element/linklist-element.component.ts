import {Component, Input, OnInit} from '@angular/core';
import {LinklistElement} from '../../model/linklist-element/linklist-element.model';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'workizy-linklist-element',
  templateUrl: './linklist-element.component.html',
  styleUrls: ['./linklist-element.component.scss'],
})
export class LinklistElementComponent implements OnInit {
  @Input() link: LinklistElement;

  constructor() { }

  ngOnInit() {}

  async openLink() {
    await Browser.open({url: this.link.link, windowName: this.link.link, presentationStyle: 'popover'});
    // this.link.link;
  }
}
