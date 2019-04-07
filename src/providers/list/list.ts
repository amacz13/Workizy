import { Injectable } from '@angular/core';

@Injectable()
export class List {

  // Unique ID for storage purposes
  private id: number;

  // List details
  private title: String;
  private cover: String;

  // Date informations
  private creationDate: number;
  private lastEditionDate: number;

  private isSynchronized: boolean;

  constructor() {
  }

}
