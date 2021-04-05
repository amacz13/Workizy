import {ChecklistElement} from '../checklist-element/checklist-element.model';
import {LinklistElement} from '../linklist-element/linklist-element.model';

export class Card {
  id: string;
  title: string;
  description: string;
  checklist: ChecklistElement[];
  linklist: LinklistElement[];
  creationDate: string;
  lastUpdateDate: string;
  image: string;

}
