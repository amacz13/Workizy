import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {List} from "../list/list";
import {UserSettings} from "../user-settings/user-settings";
import {MyApp} from "../../app/app.component";
import {ListItem} from "../list-item/list-item";
import {UuidGenerator} from "../uuid-generator/uuid-generator";
import {Link} from "../link/link";

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

  public async addList(list: List){
    console.log("Saving list into Firebase...");
    console.log(list);
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
      async (res) => {
        console.log("List added to Firebase", res);
        list.firebaseId = res.id;
        await MyApp.storageManager.saveLocalList(list);
        console.log("Refreshing lists...");
        await MyApp.storageManager.getAll();
        console.log("End Firebase addList");
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
      let obtainedList: Array<String> = new Array<String>();
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
            obtainedList.push(l.firebaseId);
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
          obtainedList.push(newList.firebaseId);
          await MyApp.storageManager.saveOnlineListFromFB(newList);
        }
      }
      await MyApp.storageManager.getAll();
      for (let l of MyApp.storageManager.onlineLists){
        console.log("Checking if list needs to be deleted : ",l);
        if (obtainedList.indexOf(l.firebaseId) <= -1){
          console.log("Removing : ",l);
          if (l.items != null && l.items.length > 0) {
            for (let it of l.items) {
              if (it.links != null && it.links.length > 0) {
                for (let l of it.links) {
                  console.log("Removing link : ", l);
                  await MyApp.storageManager.removeLink(l);
                }
              }
              console.log("Removing item : ", it);
              await MyApp.storageManager.removeItem(it);
            }
          }
          console.log("Removing list : ",l);
          await MyApp.storageManager.removeList(l);
          await MyApp.storageManager.getAll();
          await MyApp.storageManager.getAll();
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
    let links: Array<String> = new Array<String>();
    for (let l of item.links){
      links.push(l.content);
    }
    await this.afs.collection('/'+this.settings.user.email+'items').add({
      creationDate: item.creationDate,
      lastEditionDate: item.lastEditionDate,
      picture: item.picture,
      reminderDate: item.reminderDate,
      textContent: item.textContent,
      title: item.title,
      listFbId: item.list.firebaseId,
      links: links
    }).then(
      async (res) => {
        console.log("Item added to Firebase", res);
        item.firebaseId = res.id;
        for (let link of item.links) {
          link.item = item;
          await MyApp.storageManager.saveLink(link);
        }
        await MyApp.storageManager.saveListItem(item);
      }
    );
  }

  public async getItems() {
    console.log("[FM] Fetching items from Firebase...");
    return this.afs.collection('/'+this.settings.user.email+'items').ref.get().then(async data => {
      let obtainedList: Array<String> = new Array<String>();
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
            obtainedList.push(i.firebaseId);
            console.log("Links : ",itemData.links);
            for (let l of i.links) {
              await MyApp.storageManager.removeLink(l);
            }
            i.links = new Array<Link>();
            if(itemData.links != null && itemData.links.length > 0) {
              for (let l of itemData.links) {
                console.log("Link : ",l);
                let link: Link = new Link();
                link.content = l;
                link.item = i;
                i.links.push(link);
                await MyApp.storageManager.saveLink(link);
              }
            }
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
          obtainedList.push(newItem.firebaseId);
          newItem.links = new Array<Link>();
          console.log("Links : ",itemData.links);
          if(itemData.links != null && itemData.links.length > 0) {
            for (let l of itemData.links) {
              console.log("Link : ",l);
              let link: Link = new Link();
              link.content = l;
              link.item = newItem;
              newItem.links.push(link);
              await MyApp.storageManager.saveLink(link);
            }
          }
          if (l.items == null) {
            l.items = new Array<ListItem>();
            l.items.push(newItem);
          } else {
            l.items.push(newItem);
          }
          console.log("Saving list : ",l);
          await MyApp.storageManager.saveListItem(newItem);
          await MyApp.storageManager.saveOnlineListFromFB(l);
        }
        await MyApp.storageManager.getAll();
        for (let it of MyApp.storageManager.onlineItems){
          console.log("Checking if item needs to be deleted : ",it);
          if (obtainedList.indexOf(it.firebaseId) <= -1) {
            console.log("Removing : ", it);
            if (it.links != null && it.links.length > 0) {
              for (let l of it.links) {
                console.log("Removing link : ", l);
                await MyApp.storageManager.removeLink(l);
              }
            }
            console.log("Removing item : ", it);
            await MyApp.storageManager.removeItem(it);
          }
        await MyApp.storageManager.getAll();
        await MyApp.storageManager.getAll();
        }
      }
    });
  }

  public async deleteItem(item: ListItem) {
    console.log("Deleting item into Firebase...");
    await this.afs.collection('/' + this.settings.user.email + 'items').doc(item.firebaseId.toString()).delete();
  }

}
