import { Injectable } from '@angular/core';
import {ChecklistItem} from "../checklist-item/checklist-item";

@Injectable()
export class Checklist {

  private id: number;
  private items: ChecklistItem[] = new Array<ChecklistItem>();

  constructor() {

  }

}
