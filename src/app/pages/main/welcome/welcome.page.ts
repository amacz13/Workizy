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
  }

  ngOnInit() {
  }

  goToSettings() {
      this.router.navigate(['/settings'])
  }
}
