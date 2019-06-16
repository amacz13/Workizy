import {Checklist} from "../checklist/checklist";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from "typeorm";
import {List} from "../list/list";
import {Link} from "../link/link";

@Entity('listitem')
export class ListItem {

  // Unique ID for storage purposes
  @PrimaryColumn() id: String;
  @PrimaryColumn() firebaseId: String;

  // Content of the item
  @Column({nullable: true}) title: String;
  @Column({nullable: true}) textContent: String;

  @Column({nullable: true}) picture: String;
  @OneToOne(type => Checklist, cl => cl.listItem, {
    nullable: true,
    cascade: true
  }) checklist: Checklist;

  // Date informations
  @Column() creationDate: number;
  @Column() lastEditionDate: number;
  @Column({nullable: true}) reminderDate: number;

  @OneToMany(type => Link, link => link.item, {nullable: true,
    cascade: true}) links: Link[];

  @ManyToOne(type => List, list => list.items)
  list: List;

  constructor() {

  }

}
