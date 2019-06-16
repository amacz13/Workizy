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
  allItems: ListItem[] = new Array<ListItem>();
  localItems: ListItem[] = new Array<ListItem>();
  onlineItems: ListItem[] = new Array<ListItem>();

  public initRepositories() {
    this.listRepository = getRepository('list') as Repository<List>;
    this.listItemRepository = getRepository('listitem') as Repository<ListItem>;
    this.checklistRepository = getRepository('checklist') as Repository<Checklist>;
    this.checklistItemRepository = getRepository('checklistitem') as Repository<ChecklistItem>;
    this.linkRepository = getRepository('link') as Repository<Link>;
    this.getAll();
    /*let list: List = new List();
    list.title = "Test";
    list.creationDate = Date.now();
    list.lastEditionDate = Date.now();
    list.cover = "COVER";
    list.isSynchronized = true;
    this.listRepository.save(list).then( () => this.getAll());*/
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

  public syncedItemExists(fbId : String): boolean{
    for (let item of this.onlineItems) {
      if (item.firebaseId == fbId) return true;
    }
    return false;
  }

  public getSyncedItem(fbId : String): ListItem{
    for (let item of this.onlineItems) {
      if (item.firebaseId == fbId) return item;
    }
    return null;
  }

  public async saveLocalList(list: List){
    console.log("[SM] Saving local list...");
    await this.listRepository.save(list);
  }

  public async updateOnlineListFromFB(list: List){
    console.log("[SM] Updating online list in local db...");
    await this.listRepository.save(list);
  }

  public async saveOnlineListFromFB(list: List){
    console.log("[SM] Saving online list in local db...");
    await this.listRepository.save(list);
  }

  public async addSyncedList(list: List){
    console.log("[SM] Saving synced list...");
    await this.fm.addList(list);
  }

  public async addSyncedItem(item: ListItem){
    console.log("[SM] Saving synced item...");
    await this.fm.addItem(item);
  }

  /*public saveList(list: List){
    console.log("Saving list...");
    this.listRepository.save(list).then( () => {
      this.getAll();
      if (list.isSynchronized) {
        if (list.firebaseId == null){
          console.log("Saving list into firebase...");
          this.fm.addList(list).then( val => {
            this.listRepository.save(val).then( () => {
              this.getAll();
            });
          });
        } else {
          console.log("Updating list into firebase...");
          this.fm.updateList(list).then( val => {
            this.listRepository.save(val).then( () => {
              this.getAll();
            });
          });
        }
      }
      this.listRepository.save(list).then( () => {
        this.getAll();
      });
    });
  }*/

  public async saveListItem(item: ListItem){
     await this.listItemRepository.save(item);
  }

  public async saveLink(link: Link){
    await this.linkRepository.save(link);
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



  public async getAll() {
    console.log("getAll called");
    /*this.connection.manager.find(List).then( lists => {
      console.log("All lists : ",lists);
      this.allLists = lists;
    });*/
    this.localLists = new Array<List>();
    this.onlineLists = new Array<List>();

    await this.listRepository.find({ relations: ["items","items.links"] }).then(async lists => {
      this.allLists = lists;
      console.log("LISTS : ",lists);

      for (let l of this.allLists) {
        if (!l.isSynchronized){
          await this.localLists.push(l);
        } else {
          await this.onlineLists.push(l);
        }
      }
    });

    this.localItems = new Array<ListItem>();
    this.onlineItems = new Array<ListItem>();

    await this.listItemRepository.find({ relations: ["list","links"] }).then(async items => {
      this.allItems = items;
      console.log("ITEMS : ",items);

      for (let l of this.allItems) {
        if (!l.list.isSynchronized){
          await this.localItems.push(l);
        } else {
          await this.onlineItems.push(l);
        }
      }
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

  public async removeLink(link: Link){
    await this.linkRepository.remove(link);
  }

  public removeAllOnlineLists(){
    for (let list of this.onlineLists) {
      this.listRepository.remove(list);
    }
  }

  public removeAllOnlineItems(){
    for (let item of this.onlineItems) {
      this.listItemRepository.remove(item);
    }
  }

}
