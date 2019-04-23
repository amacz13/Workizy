import {ListItem} from "../list-item/list-item";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity('link')
export class Link {

  // Unique ID for storage purposes
  @PrimaryGeneratedColumn() private _id: number;

  @ManyToOne(type => ListItem, listItem => listItem.links, {
    cascade: ['insert']
  }) private _item: ListItem;

  @Column() private _content: String;

  get content(): String {
    return this._content;
  }

  set content(value: String) {
    this._content = value;
  }
  get item(): ListItem {
    return this._item;
  }

  set item(value: ListItem) {
    this._item = value;
  }
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  constructor() {
  }

}
