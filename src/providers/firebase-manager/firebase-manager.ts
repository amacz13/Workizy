import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {List} from "../list/list";
import {UserSettings} from "../user-settings/user-settings";
import {ListItem} from "../list-item/list-item";
import {rejects} from "assert";

@Injectable()
export class FirebaseManager {

  constructor(public afs: AngularFirestore, public settings: UserSettings) {
  }

  public addList(list: List){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/lists').add({
        user: this.settings.user.email,
        title: list.title,
        coverSource: list.coverSource,
        isSynchronized: list.isSynchronized,
        items: list.items,
        cover: list.cover,
        listType: list.listType,
        lastEditionDate: list.lastEditionDate,
        creationDate: list.creationDate,
        id: list.id,
      }).then(
          (res) => {
            console.log("List added to Firebase", res);
            list.firebaseId = res.id;
            resolve(list)
          },
          err => reject(err)
        )
    });
  }

  public updateList(list: List) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/lists').doc(list.firebaseId.toString()).update({
        title: list.title,
        coverSource: list.coverSource,
        isSynchronized: list.isSynchronized,
        items: list.items,
        cover: list.cover,
        listType: list.listType,
        lastEditionDate: list.lastEditionDate,
        creationDate: list.creationDate,
        id: list.id,
      }).then((res) => {
          console.log("List updated to Firebase", res);
          resolve(list)
        },
        err => reject(err)
      )
    });
  }

  syncLists() {

  }


}
