import { Injectable } from '@angular/core';
import {List} from "../list/list";
import {Connection, getRepository, Repository} from "typeorm";
import {ListItem} from "../list-item/list-item";
import {Checklist} from "../checklist/checklist";
import {ChecklistItem} from "../checklist-item/checklist-item";
import {Link} from "../link/link";
import {FirebaseManager} from "../firebase-manager/firebase-manager";

@Injectable()
export class StorageManager {

  allLists: List[] = new Array<List>();
  localLists: List[] = new Array<List>();
  onlineLists: List[] = new Array<List>();

  public initRepositories() {
    this.listRepository = getRepository('list') as Repository<List>;
    this.listItemRepository = getRepository('listitem') as Repository<ListItem>;
    this.checklistRepository = getRepository('checklist') as Repository<Checklist>;
    this.checklistItemRepository = getRepository('checklistitem') as Repository<ChecklistItem>;
    this.linkRepository = getRepository('link') as Repository<Link>;
    this.getLists();
    /*let list: List = new List();
    list.title = "Test";
    list.creationDate = Date.now();
    list.lastEditionDate = Date.now();
    list.cover = "COVER";
    list.isSynchronized = true;
    this.listRepository.save(list).then( () => this.getLists());*/
  }

  listRepository: Repository<List>;
  listItemRepository: Repository<ListItem>;
  checklistRepository: Repository<Checklist>;
  checklistItemRepository: Repository<ChecklistItem>;
  linkRepository: Repository<Link>;

  connection: Connection;

  constructor(public fm: FirebaseManager) {
  }

  public syncedListExists(fbId : String): boolean{
    for (let list of this.allLists) {
      if (list.firebaseId == fbId) return true;
    }
    return false;
  }

  public getSyncedList(fbId : String): List{
    for (let list of this.allLists) {
      if (list.firebaseId == fbId) return list;
    }
    return null;
  }

  public saveLocalList(list: List){
    console.log("[SM] Saving local list...");
    this.listRepository.save(list).then( () => {
      this.getLists();
    });
  }


  public updateOnlineListFromFB(list: List){
    console.log("[SM] Updating online list in local db...");
    this.listRepository.update(list.firebaseId.toString(),list).then( () => {
      this.getLists();
    });
  }

  public saveOnlineListFromFB(list: List){
    console.log("[SM] Saving online list in local db...");
    this.listRepository.save(list).then( () => {
      this.getLists();
    });
  }

  public addSyncedList(list: List){
    console.log("[SM] Saving synced list...");
    return this.fm.addList(list);
  }

  public addSyncedItem(item: ListItem){
    console.log("[SM] Saving synced item...");
    return this.fm.addItem(item).then();
  }

  public updateSyncedList(list: List){
    console.log("[SM] Updating synced list...");
    this.fm.updateList(list).then( val => {
      this.listRepository.save(val).then( () => {
        this.getLists();
      });
    });
  }

  /*public saveList(list: List){
    console.log("Saving list...");
    this.listRepository.save(list).then( () => {
      this.getLists();
      if (list.isSynchronized) {
        if (list.firebaseId == null){
          console.log("Saving list into firebase...");
          this.fm.addList(list).then( val => {
            this.listRepository.save(val).then( () => {
              this.getLists();
            });
          });
        } else {
          console.log("Updating list into firebase...");
          this.fm.updateList(list).then( val => {
            this.listRepository.save(val).then( () => {
              this.getLists();
            });
          });
        }
      }
      this.listRepository.save(list).then( () => {
        this.getLists();
      });
    });
  }*/

  public saveListItem(item: ListItem){
    this.listItemRepository.save(item);
  }

  public saveLink(link: Link){
    this.linkRepository.save(link);
  }

  public getListItems(list: List):ListItem[] {
    let listItems: ListItem[] = new Array<ListItem>();
    this.listItemRepository.find({list:list}).then(items => {
      console.log("Fetching items : ");
      console.log(items);
      listItems = items;
    });
    return listItems;
  }

  public getList(id: number):Promise<List> {
    return this.listRepository.findOne(id);
  }



  public getLists():any {
    /*this.connection.manager.find(List).then( lists => {
      console.log("All lists : ",lists);
      this.allLists = lists;
    });*/
    this.localLists = new Array<List>();
    this.onlineLists = new Array<List>();

    this.listRepository.find({ relations: ["items"] }).then(lists => {
      console.log("All lists : ",lists);
      this.allLists = lists;

      for (let l of this.allLists) {
        if (!l.isSynchronized){
          this.localLists.push(l);
        } else {
          this.onlineLists.push(l);
        }
      }
      console.log("Local lists : ",this.localLists);
    });
    /*
    this.listRepository.find({isSynchronized:false}).then(lists => {
      console.log("Local lists : ",lists);
      this.localLists = lists;
    });
    this.listRepository.find({isSynchronized:true}).then(lists => {
      console.log("Online lists : ",lists);
      this.onlineLists = lists;
    });*/
  }

  public removeList(list: List){
    this.listRepository.remove(list);
  }

  public removeAllOnlineLists(){
    for (let list of this.onlineLists) {
      this.listRepository.remove(list);
    }
  }

}
