import {Component, Input, OnInit} from '@angular/core';
import {ChecklistElement} from '../../model/checklist-element/checklist-element.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'workizy-checklist-element',
  templateUrl: './checklist-element.component.html',
  styleUrls: ['./checklist-element.component.scss'],
})
export class ChecklistElementComponent implements OnInit {
  @Input() checklistElement: ChecklistElement;

  constructor() { }

  ngOnInit() {}

  buttonClicked() {
    this.checklistElement.checked = this.checklistElement.checked ? false : true;
  }
}
