import {EventEmitter, Injectable, Output} from '@angular/core';
import {List} from '../../model/list/list.model';
import {LocalStorageService} from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {


  constructor(private localStorage: LocalStorageService) { }

  getListById(listId: string): Promise<List> {
    return this.localStorage.getList(listId);
  }

  getAllLists(): Promise<List[]> {
    return this.localStorage.getLists();
  }

  searchList(query: string): Promise<List[]> {
    return new Promise<List[]>(async (resolve, reject) => {
      let allLists: List[] = await this.getAllLists();
      let searchResult: List[] = [];
      for (let list of allLists) if (list.title.toLowerCase().includes(query.toLowerCase())) searchResult.push(list);
      resolve(searchResult);
    })
  }

  saveList(list: List): Promise<any> {
    return this.localStorage.saveList(list);
  }

  deleteList(list: List) {
    this.localStorage.deleteList(list.id);
  }
}
