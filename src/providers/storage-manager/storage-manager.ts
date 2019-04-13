import { Injectable } from '@angular/core';
import {List} from "../list/list";
import {ListItem} from "../list-item/list-item";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {SqlQueries} from "../sql-queries/sql-queries";
import {NativeStorage} from "@ionic-native/native-storage";
import {Platform} from "ionic-angular";

@Injectable()
export class StorageManager {

  public static allLists: Array<List> = new Array<List>();
  public static localLists: Array<List> = new Array<List>();
  public static syncedLists: Array<List> = new Array<List>();

  private database: SQLiteObject;

  constructor(private sqlite: SQLite, private storage: NativeStorage, private pl: Platform) {
    this.pl.ready().then(() => {
      console.log("Initializing storage system...");
      this.storage.clear().then(()=> console.log("TEST OK"));

      this.sqlite.create({
        name: 'whatsnext-data.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.database.executeSql(SqlQueries.createListTable, []).then(() => {
          console.log("TABLE list CREATED !");
          this.database.executeSql(SqlQueries.createItemTable, []).then(() => {
          console.log("All is good !");
          }).catch(e => {
            console.error("Error during database operation (CREATION_ITEM_TABLE) : ");
            console.error(e.message);
          });
        }).catch(e => {
          console.error("Error during database operation (CREATION_LIST_TABLE) : ");
          console.error(e.message);
        });
      }).catch(e => console.error("There was an error during database creation/opening : " + e));
    });
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
