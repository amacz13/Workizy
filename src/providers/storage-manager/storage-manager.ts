import { Injectable } from '@angular/core';
import {List} from "../list/list";
import {ListItem} from "../list-item/list-item";

@Injectable()
export class StorageManager {

  constructor() {

  }

  saveListItem(item: ListItem):void {

  }

  getListItem(id: number):ListItem {
    return new ListItem();
  }

  saveList(list: List):void {

  }

  getList(id: number):List {
    return new List();
  }

}
