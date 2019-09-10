import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {List} from "../list/list";
import {Link} from "../link/link";
import {ChecklistItem} from "../checklist-item/checklist-item";

@Entity('listitem')
export class ListItem {

  // Unique ID for storage purposes
  @PrimaryColumn() id: String;
  @PrimaryColumn() firebaseId: String;

  // Content of the item
  @Column({nullable: true}) title: String;
  @Column({nullable: true}) textContent: String;

  @Column({nullable: true}) picture: String;
  @Column({nullable: true}) musicURL: String;

  // Date informations
  @Column() creationDate: number;
  @Column() lastEditionDate: number;
  @Column({nullable: true}) reminderDate: number;

  @OneToMany(type => Link, link => link.item, {nullable: true,
    cascade: true}) links: Link[];


  @OneToMany(type => ChecklistItem, checklistitem => checklistitem.listitem, {nullable: true,
    cascade: true}) checklistitems: ChecklistItem[];

  @ManyToOne(type => List, list => list.items)
  list: List;

  constructor() {

  }

}
