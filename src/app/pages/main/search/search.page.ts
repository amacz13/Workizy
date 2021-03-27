import { Component, OnInit } from '@angular/core';
import {List} from '../../../model/list/list.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  search: string;
  list1: List = new List();

  constructor() {
    this.list1.title = 'A List';
    this.list1.background = 'background1';
  }

  ngOnInit() {
  }

}
