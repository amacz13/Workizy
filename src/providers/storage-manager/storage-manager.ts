import { Injectable } from '@angular/core';
import {List} from "../list/list";
import {ListItem} from "../list-item/list-item";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {SqlQueries} from "../sql-queries/sql-queries";

@Injectable()
export class StorageManager {

  private database: SQLiteObject;

  constructor(private sqlite: SQLite) {
    this.sqlite.create({
      name: 'whatsnext-data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.database = db;
      this.database.executeSql(SqlQueries.createListTable.toString()).then(() => {
        this.database.executeSql(SqlQueries.createItemTable.toString()).then( () => {

        }).catch(e => console.error("Error during database operation : "+e));
      }).catch(e => console.error("Error during database operation : "+e));
    }).catch(e => console.error("There was an error during database creation/opening : "+e));
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
