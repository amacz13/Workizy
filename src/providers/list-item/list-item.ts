import {Checklist} from "../checklist/checklist";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {List} from "../list/list";
import {Link} from "../link/link";

@Entity('listitem')
export class ListItem {

  // Unique ID for storage purposes
  @PrimaryGeneratedColumn() private _id: number;

  // Content of the item
  @Column({nullable: true}) private _title: String;
  @Column({nullable: true}) private _textContent: String;
  @Column({nullable: true}) private _picture: String;
  @OneToOne(type => Checklist, cl => cl.listItem, {
    nullable: true
  })
  @JoinColumn() private _checklist: Checklist;

  // Date informations
  @Column() private _creationDate: number;
  @Column() private _lastEditionDate: number;
  @Column({nullable: true}) private _reminderDate: number;
  @OneToMany(type => Link, link => link.item) private _links: Link[];

  @ManyToOne(type => List, list => list.items, {
    cascade: ['insert']
  }) private _list: List;

  get list(): List {
    return this._list;
  }

  set list(value: List) {
    this._list = value;
  }
  get links(): Link[] {
    return this._links;
  }

  set links(value: Link[]) {
    this._links = value;
  }
  get reminderDate(): number {
    return this._reminderDate;
  }

  set reminderDate(value: number) {
    this._reminderDate = value;
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
  get checklist(): Checklist {
    return this._checklist;
  }

  set checklist(value: Checklist) {
    this._checklist = value;
  }
  get picture(): String {
    return this._picture;
  }

  set picture(value: String) {
    this._picture = value;
  }
  get textContent(): String {
    return this._textContent;
  }

  set textContent(value: String) {
    this._textContent = value;
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

  constructor() {

  }

}
