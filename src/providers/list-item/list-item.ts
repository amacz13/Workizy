import { Injectable } from '@angular/core';
import {Checklist} from "../checklist/checklist";

@Injectable()
export class ListItem {

  // Unique ID for storage purposes
  private id: number;

  // Content of the item
  private title: String;
  private textContent: String;
  private picture: String;
  private checklist: Checklist;

  // Date informations
  private creationDate: number;
  private lastEditionDate: number;
  private reminderDate: number;

  constructor() {

  }

}
