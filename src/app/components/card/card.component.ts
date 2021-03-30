import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../../model/card/card.model';
import {LinklistElement} from '../../model/linklist-element/linklist-element.model';
import {ChecklistElement} from '../../model/checklist-element/checklist-element.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'workizy-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() card: Card;

  constructor() {
  }

  ngOnInit() {}

  linkClicked() {

  }
}
