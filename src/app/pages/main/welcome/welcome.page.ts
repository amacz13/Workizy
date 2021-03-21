import { Component, OnInit } from '@angular/core';
import { Card } from '../../../model/card/card.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  card: Card = new Card();

  constructor() {
    this.card.title = 'Title';
    this.card.description = 'This is a description';
    this.card.creationDate = '04/09/2021';
  }

  ngOnInit() {
  }

}
