import { Injectable } from '@angular/core';
import {List} from "../list/list";
import {getRepository, Repository} from "typeorm";

@Injectable()
export class StorageManager {

  public static initRepositories() {
    this.listRepository = getRepository('list') as Repository<List>;
    this.getList(1).then( val => console.log(val));
    /*let list: List = new List();
    list.title = "Test";
    list.creationDate = Date.now();
    list.lastEditionDate = Date.now();
    list.cover = "COVER";
    list.isSynchronized = true;
    this.listRepository.save(list).then( () => this.getLists());*/
  }

  static listRepository: Repository<List>;

  connection: any;

  constructor() {
  }

  static saveList(list: List){
    StorageManager.listRepository.save(list);
  }


  static getList(id: number):Promise<List> {
    return StorageManager.listRepository.findOne(id);
  }

  static getLists():any {
    StorageManager.listRepository.find().then(lists => console.log("All lists : ",lists));
  }

}
