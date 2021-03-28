import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {List} from '../../../model/list/list.model';
import {ListService} from '../../../services/list/list.service';
import {ViewDidEnter} from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements ViewDidEnter {

  search: string;
  list1: List = new List();
  searchResults: List[] = [];
  mapKeys: string[] = [];
  allListsAlphabetically: Map<string,List[]> = new Map<string, List[]>();

  constructor(private listService: ListService) {
  }

  ionViewDidEnter(): void {
    this.refreshLists();
  }


  onSearch($event: any) {
    console.log("On search : ",$event);
    this.listService.searchList($event).then( results => {
      this.searchResults = results;
    });
  }

  refreshLists() {
    this.listService.getAllLists().then( allLists => {
      this.allListsAlphabetically = new Map<string, List[]>();
      for (let list of allLists) {
        if (!this.allListsAlphabetically.has(list.title[0].toUpperCase())) this.allListsAlphabetically.set(list.title[0].toUpperCase(), []);
        let listsWithSameLetter: List[] = this.allListsAlphabetically.get(list.title[0]);
        listsWithSameLetter.push(list);
        this.allListsAlphabetically.set(list.title[0], listsWithSameLetter);
      }
      this.mapKeys = Array.from(this.allListsAlphabetically.keys()).sort();
      console.log('Keys: ',this.mapKeys)
    });
  }
}
