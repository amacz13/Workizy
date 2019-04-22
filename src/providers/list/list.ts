import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ListItem} from "../list-item/list-item";

@Entity('list')
export class List {

  get listType(): String {
    return this._listType;
  }

  set listType(value: String) {
    this._listType = value;
  }
  get items(): ListItem[] {
    return this._items;
  }

  set items(value: ListItem[]) {
    this._items = value;
  }
  get isSynchronized(): boolean {
    return this._isSynchronized;
  }

  set isSynchronized(value: boolean) {
    this._isSynchronized = value;
  }
  get lastEditionDate(): number {
    return this._lastEditionDate;
  }

  set lastEditionDate(value: number) {
    this._lastEditionDate = value;
  }
  get creationDate(): number {
    return this._creationDate;
  }

  set creationDate(value: number) {
    this._creationDate = value;
  }
  get cover(): String {
    return this._cover;
  }

  set cover(value: String) {
    this._cover = value;
  }
  get title(): String {
    return this._title;
  }

  set title(value: String) {
    this._title = value;
  }
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  // Unique ID for storage purposes
  @PrimaryGeneratedColumn() private _id: number;

  // List details
  @Column() private _title: String;
  @Column() private _cover: String;
  @Column() private _listType: String;

  // Date informations
  @Column() private _creationDate: number;
  @Column() private _lastEditionDate: number;

  @Column() private _isSynchronized: boolean;

  @OneToMany(type => ListItem, item => item.list) private _items: ListItem[];

  constructor() {
  }
}
