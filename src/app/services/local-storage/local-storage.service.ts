import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import {List} from '../../model/list/list.model';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {

  }

  saveList(list: List): Promise<any> {
    return Storage.set({key: 'list_' + list.id, value: JSON.stringify(list)});
  }

  getList(listId: string): Promise<List> {
    return this._getList('list_'+listId);
  }

  _getList(key: string): Promise<List> {
    return new Promise<List>(async (resolve, reject) => {
      let listAsString = await Storage.get({key: key});
      if (listAsString && listAsString.value) resolve(JSON.parse(listAsString.value));
      reject('Not Found');
    })
  }

  getLists(): Promise<List[]> {
    return new Promise<List[]>(async (resolve, reject) => {
      let lists: List[] = [];
      const keysArray = await Storage.keys();
      for (let key of keysArray.keys) {
        if (key.startsWith('list_')) {
          let l: List = await this._getList(key);
          lists.push(l);
        }
      }
      resolve(lists);
    });
  }

  async deleteList(listId: string){
    await Storage.remove({key: 'list_'+listId});
  }
}
