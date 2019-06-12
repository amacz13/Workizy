import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {List} from "../list/list";
import {UserSettings} from "../user-settings/user-settings";
import {MyApp} from "../../app/app.component";
import {ListItem} from "../list-item/list-item";

@Injectable()
export class FirebaseManager {

  constructor(public afs: AngularFirestore, public settings: UserSettings) {
  }

  /*
  sync
  Retrieve all informations from Firebase
   */

  public sync() {
    return this.getLists().then(() =>{
      this.getItems();
    });
  }

  public addList(list: List){
    console.log("Saving list into Firebase...");
    console.log(list);
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/'+this.settings.user.email+'lists').add({
        title: list.title,
        coverSource: list.coverSource,
        isSynchronized: list.isSynchronized,
        //items: list.items,
        cover: list.cover,
        listType: list.listType,
        lastEditionDate: list.lastEditionDate,
        creationDate: list.creationDate
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
      this.afs.collection('/'+this.settings.user.email+'lists').doc(list.firebaseId.toString()).update({
        title: list.title,
        coverSource: list.coverSource,
        isSynchronized: list.isSynchronized,
        items: list.items,
        cover: list.cover,
        listType: list.listType,
        lastEditionDate: list.lastEditionDate,
        creationDate: list.creationDate
      }).then((res) => {
          console.log("List updated to Firebase", res);
          resolve(list)
        },
        err => reject(err)
      )
    });
  }

  getLists() {
    MyApp.storageManager.removeAllOnlineLists();
    return this.afs.collection('/'+this.settings.user.email+'lists').ref.get().then(data => {
      for (let list of data.docs) {
        let listData = list.data();
        let newList: List = new List();
        if (MyApp.storageManager.syncedListExists(list.id)) {
          let l = MyApp.storageManager.getSyncedList(list.id);
          if (l.lastEditionDate > listData.lastEditionDate) {
            this.updateList(l);
          } else {
            newList.cover = listData.cover;
            newList.coverSource = listData.coverSource;
            newList.lastEditionDate = listData.lastEditionDate;
            newList.firebaseId = listData.firebaseId;
            newList.creationDate = listData.creationDate;
            newList.isSynchronized = listData.isSynchronized;
            newList.listType = listData.listType;
            newList.title = listData.title;
            MyApp.storageManager.updateOnlineListFromFB(newList);
          }
        } else {
          newList.cover = listData.cover;
          newList.coverSource = listData.coverSource;
          newList.lastEditionDate = listData.lastEditionDate;
          newList.firebaseId = listData.firebaseId;
          newList.creationDate = listData.creationDate;
          newList.isSynchronized = listData.isSynchronized;
          newList.listType = listData.listType;
          newList.title = listData.title;
          MyApp.storageManager.saveOnlineListFromFB(newList);
        }
      }
    });
  }

  public deleteList(list: List){
    return this.afs.collection('/' + this.settings.user.email + 'lists').doc(list.firebaseId.toString()).delete();
  }

  /*

  Items Synchronization
  Items are stored individually from their list and are associated with their list when they are retrieved.

   */

  /*
  addItem
  Add a ListItem in Firebase
   */

  public addItem(item: ListItem) {
    console.log("Saving item into Firebase...");
    console.log(item);
    let list: List = item.list;
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/'+this.settings.user.email+'items').add({
        creationDate: item.creationDate,
        lastEditionDate: item.lastEditionDate,
        picture: item.picture,
        reminderDate: item.reminderDate,
        textContent: item.textContent,
        title: item.title,
        listFbId: item.list.firebaseId
      }).then(
        (res) => {
          console.log("Item added to Firebase", res);
          item.firebaseId = res.id;
          resolve(list)
        },
        err => reject(err)
      )
    });
  }

  /*
  getItems
  Retrieved all Items and
   */

  getItems() {
    return this.afs.collection('/'+this.settings.user.email+'items').ref.get().then(data => {
      console.log("Fetching items...");
      console.log(data.docs);
      for (let items of data.docs) {
        let itemData = items.data();
        console.log("Item get :");
        console.log(itemData);
        let item: ListItem = new ListItem();
        item.title = itemData.title;
        item.reminderDate = itemData.reminderDate;
        item.firebaseId = items.id;
        item.textContent = itemData.textContent;
        item.picture = itemData.picture;
        item.creationDate = itemData.creationDate;
        let l = MyApp.storageManager.getSyncedList(itemData.listFbId);
        l.items.push(item);
        MyApp.storageManager.updateOnlineListFromFB(l);
      }
    });
  }


}
