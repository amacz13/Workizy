import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {List} from "../list/list";
import {UserSettings} from "../user-settings/user-settings";
import {StorageManager} from "../storage-manager/storage-manager";
import {MyApp} from "../../app/app.component";

@Injectable()
export class FirebaseManager {



  constructor(public afs: AngularFirestore, public settings: UserSettings) {
  }

  public addList(list: List){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/'+this.settings.user.email+'lists').add({
        title: list.title,
        coverSource: list.coverSource,
        isSynchronized: list.isSynchronized,
        //items: list.items,
        cover: list.cover,
        listType: list.listType,
        lastEditionDate: list.lastEditionDate,
        creationDate: list.creationDate,
        id: list.id,
      }).then(
          (res) => {
            console.log("List added to Firebase", res);
            list.firebaseId = res.id;
            for (let item of list.items){
              this.afs.collection('/'+this.settings.user.email+'lists/'+res.id+'/items').add({
                id: item.id,
                reminderDate: item.reminderDate,
                pictureSource: item.pictureSource,
                creationDate: item.creationDate,
                lastEditionDate: item.lastEditionDate,
                picture: item.picture,
                title: item.title,
                textContent: item.textContent
              }).then( r => {
                item.firebaseId = r.id;
              });
            }
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
        creationDate: list.creationDate,
        id: list.id,
      }).then((res) => {
          console.log("List updated to Firebase", res);
          for (let item of list.items){
            this.afs.collection('/'+this.settings.user.email+'lists/'+list.id+'/items').doc(item.firebaseId.toString()).update({
              id: item.id,
              reminderDate: item.reminderDate,
              pictureSource: item.pictureSource,
              creationDate: item.creationDate,
              lastEditionDate: item.lastEditionDate,
              picture: item.picture,
              title: item.title,
              textContent: item.textContent
            });
          }
          resolve(list)
        },
        err => reject(err)
      )
    });
  }

  getLists() {
    this.afs.collection('/'+this.settings.user.email+'lists').ref.get().then(data => {
      for (let list of data.docs){
        let listData = list.data();
        console.log(list.data());
        if (MyApp.storageManager.syncedListExists(list.id)) {
          let l = MyApp.storageManager.getSyncedList(list.id);
          if (l.lastEditionDate > listData.lastEditionDate) {
            this.updateList(l);
          } else {
            let newList:List = new List();
            newList.cover = listData.cover;
            newList.coverSource = listData.coverSource;
            newList.lastEditionDate = listData.lastEditionDate;
            newList.firebaseId = listData.firebaseId;
            newList.creationDate = listData.creationDate;
            newList.id = listData.id;
            newList.isSynchronized = listData.isSynchronized;
            newList.listType = listData.listType;
            newList.title = listData.title;
            MyApp.storageManager.saveList(newList);
          }
        } else {
          let newList:List = new List();
          newList.cover = listData.cover;
          newList.coverSource = listData.coverSource;
          newList.lastEditionDate = listData.lastEditionDate;
          newList.firebaseId = listData.firebaseId;
          newList.creationDate = listData.creationDate;
          newList.id = listData.id;
          newList.isSynchronized = listData.isSynchronized;
          newList.listType = listData.listType;
          newList.title = listData.title;
          MyApp.storageManager.saveList(newList);
        }
      }
    });
  }


}
