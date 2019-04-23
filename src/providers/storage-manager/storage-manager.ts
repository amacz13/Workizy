import { Injectable } from '@angular/core';
import {List} from "../list/list";
import {getRepository, Repository} from "typeorm";
import {ListItem} from "../list-item/list-item";
import {Checklist} from "../checklist/checklist";
import {ChecklistItem} from "../checklist-item/checklist-item";
import {Link} from "../link/link";

@Injectable()
export class StorageManager {

  allLists: List[];
  localLists: List[];
  onlineLists: List[];

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

  connection: any;

  constructor() {
  }

  public saveList(list: List){
    this.listRepository.save(list).then( () => {
      this.getLists();
    });
  }


  public getList(id: number):Promise<List> {
    return this.listRepository.findOne(id);
  }

  public getLists():any {
    this.listRepository.find().then(lists => {
      console.log("All lists : ",lists)
      this.allLists = lists;
    });
    this.listRepository.find({isSynchronized:false}).then(lists => {
      console.log("Local lists : ",lists);
      this.localLists = lists;
    });
    this.listRepository.find({isSynchronized:true}).then(lists => {
      console.log("Online lists : ",lists);
      this.onlineLists = lists;
    });
  }

}
