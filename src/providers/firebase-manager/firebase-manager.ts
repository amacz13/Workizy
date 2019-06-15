import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {List} from "../list/list";
import {UserSettings} from "../user-settings/user-settings";
import {MyApp} from "../../app/app.component";
import {ListItem} from "../list-item/list-item";
import {UuidGenerator} from "../uuid-generator/uuid-generator";

@Injectable()
export class FirebaseManager {

  constructor(public afs: AngularFirestore, public settings: UserSettings) {
  }

  /*
  sync
  Retrieve all informations from Firebase
   */

  public async sync() {
    return await this.getLists().then(async() => {
      await MyApp.storageManager.getAll().then(async () => {
        await this.getItems().then(async () => {
          await MyApp.storageManager.getAll();
        });
      });
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

  public async getLists() {
    console.log("[FM] Fetching lists from Firebase...");
    //MyApp.storageManager.removeAllOnlineLists();
    return this.afs.collection('/'+this.settings.user.email+'lists').ref.get().then(async data => {
      for (let list of data.docs) {
        let listData = list.data();
        let newList: List = new List();
        if (MyApp.storageManager.syncedListExists(list.id)) {
          let l = MyApp.storageManager.getSyncedList(list.id);
          if (l.lastEditionDate > listData.lastEditionDate) {
            console.log("[FM] Local list is most recent, updating list in Firebase");
            this.updateList(l);
          } else {
            console.log("[FM] Updating list locally");
            l.cover = listData.cover;
            l.coverSource = listData.coverSource;
            l.lastEditionDate = listData.lastEditionDate;
            l.firebaseId = list.id;
            l.creationDate = listData.creationDate;
            l.isSynchronized = listData.isSynchronized;
            l.listType = listData.listType;
            l.title = listData.title;
            await MyApp.storageManager.updateOnlineListFromFB(l);
          }
        } else {
          console.log("[FM] Creating list locally");
          newList.id = UuidGenerator.getUUID();
          newList.cover = listData.cover;
          newList.coverSource = listData.coverSource;
          newList.lastEditionDate = listData.lastEditionDate;
          newList.firebaseId = list.id;
          newList.creationDate = listData.creationDate;
          newList.isSynchronized = listData.isSynchronized;
          newList.listType = listData.listType;
          newList.title = listData.title;
          newList.items = new Array<ListItem>();
          await MyApp.storageManager.saveOnlineListFromFB(newList);
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

  public async addItem(item: ListItem) {
    console.log("Saving item into Firebase...");
    console.log(item);
    let list: List = item.list;
    await this.afs.collection('/'+this.settings.user.email+'items').add({
      creationDate: item.creationDate,
      lastEditionDate: item.lastEditionDate,
      picture: item.picture,
      reminderDate: item.reminderDate,
      textContent: item.textContent,
      title: item.title,
      listFbId: item.list.firebaseId
    }).then(
      async (res) => {
        console.log("Item added to Firebase", res);
        item.firebaseId = res.id;
        await MyApp.storageManager.saveListItem(item);
      }
    );
  }

  /*
  getItems
  Retrieved all Items and
   */

  /*getItems() {
    return this.afs.collection('/'+this.settings.user.email+'items').ref.get().then(data => {
      console.log("[FM] Fetching items...");
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
        item.lastEditionDate = itemData.lastEditionDate;
        let l:List = MyApp.storageManager.getSyncedList(itemData.listFbId);
        console.log("[FM] List to add item : ");
        console.log(l);
        console.log("[FM] Creating new item list...");
        if (l == null) l = MyApp.storageManager.getSyncedList(itemData.listFbId);
        let newItemList:Array<ListItem> = new Array<ListItem>();
        if (l.items.length > 0) {
          for (let i of l.items) {
            if (i.firebaseId == items.id) {
              if (i.lastEditionDate > item.lastEditionDate) {
                newItemList.push(i);
                // Need to update item in Firebase
              } else {
                newItemList.push(item);
              }
            } else {
              newItemList.push(i);
            }
          }
        } else {
          newItemList.push(item);
        }
        MyApp.storageManager.saveListItem(item);
        l.items = newItemList;
        console.log("[FM] Updating list & items locally");
        MyApp.storageManager.updateOnlineListFromFB(l);
      }
    });
  }*/

  public async getItems() {
    console.log("[FM] Fetching items from Firebase...");
    return this.afs.collection('/'+this.settings.user.email+'items').ref.get().then(async data => {
      for (let item of data.docs) {
        let itemData = item.data();
        let newItem: ListItem = new ListItem();
        let l = MyApp.storageManager.getSyncedList(itemData.listFbId);
        if (MyApp.storageManager.syncedItemExists(item.id)) {
          let i = MyApp.storageManager.getSyncedItem(item.id);
          if (i.lastEditionDate > itemData.lastEditionDate) {
            console.log("[FM] Local item is most recent, updating item in Firebase");
            // this.updateItem(i);
          } else {
            console.log("[FM] Updating item locally");
            i.firebaseId = item.id;
            i.lastEditionDate = itemData.lastEditionDate;
            i.creationDate = itemData.creationDate;
            i.picture = itemData.picture;
            i.textContent = itemData.textContent;
            i.reminderDate = itemData.reminderDate;
            i.title = itemData.title;
            if (l.items.length > 0) {
              l.items.forEach((it, index) => {
                if (it.firebaseId == i.firebaseId) {
                  l.items.splice(index,1);
                }
              });
            }
            l.items.push(i);
            console.log("Saving list : ",l);
            await MyApp.storageManager.saveListItem(i);
            await MyApp.storageManager.saveOnlineListFromFB(l);
          }
        } else {
          console.log("[FM] Creating item locally in list : ",l);
          newItem.id = UuidGenerator.getUUID();
          newItem.firebaseId = item.id;
          newItem.lastEditionDate = itemData.lastEditionDate;
          newItem.creationDate = itemData.creationDate;
          newItem.picture = itemData.picture;
          newItem.textContent = itemData.textContent;
          newItem.reminderDate = itemData.reminderDate;
          newItem.title = itemData.title;
          newItem.list = l;
          if (l.items == null) {
            console.log("FDP");
            l.items = new Array<ListItem>();
            l.items.push(newItem);
          } else {
            l.items.push(newItem);
          }
          console.log("Saving list : ",l);
          await MyApp.storageManager.saveListItem(newItem);
          await MyApp.storageManager.saveOnlineListFromFB(l);
        }
      }
    });
  }

}
