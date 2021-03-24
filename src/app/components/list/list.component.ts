import {Component, Input, OnInit} from '@angular/core';
import {List} from '../../model/list/list.model';

@Component({
  selector: 'workizy-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @Input() list: List;

  constructor() { }

  ngOnInit() {}

}
