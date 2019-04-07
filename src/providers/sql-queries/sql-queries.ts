import { Injectable } from '@angular/core';

@Injectable()
export class SqlQueries {

  public static createListTable: String = "CREATE TABLE IF NOT EXISTS list ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, cover TEXT NOT NULL, creationDate INTEGER NOT NULL, lastEditionDate INTEGER NOT NULL, isSynchronized INTEGER NOT NULL );";
  public static createItemTable: String = "create table IF NOT EXISTS item ( id INTEGER constraint item_pk primary key autoincrement, listId INTEGER not null constraint list_link references list, title TEXT, content TEXT, picture TEXT, creationDate INTEGER not null, lastEditionDate INTEGER not null, reminderDate INTEGER );";

  constructor() {
  }

}
