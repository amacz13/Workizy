import { Component, OnInit } from '@angular/core';
import { Card } from '../../../model/card/card.model';
import { Router } from '@angular/router';
import { List } from '../../../model/list/list.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  card: Card = new Card();
  list1: List = new List();
  list2: List = new List();
  list3: List = new List();
  list4: List = new List();
  list5: List = new List();
  list6: List = new List();

  constructor(private router: Router) {
    this.card.title = 'Title';
    this.card.description = 'This is a description';
    this.card.creationDate = '04/09/2021';

    this.list1.title = 'List 1';
    this.list1.background = 'background1';
    this.list2.title = 'List 2';
    this.list2.background = 'background2';
    this.list3.title = 'List 3';
    this.list3.background = 'background3';
    this.list4.title = 'List 4';
    this.list4.background = 'background4';
    this.list5.title = 'List 5';
    this.list5.background = 'background5';
    this.list6.title = 'List 6';
    this.list6.background = 'background6';
  }

  ngOnInit() {
  }

  goToSettings() {
      this.router.navigate(['/settings'])
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
}
