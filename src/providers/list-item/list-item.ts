import {Checklist} from "../checklist/checklist";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {List} from "../list/list";
import {Link} from "../link/link";

@Entity('listitem')
export class ListItem {

  // Unique ID for storage purposes
  @PrimaryGeneratedColumn() id: number;
  @Column({nullable: true}) firebaseId: String;

  // Content of the item
  @Column({nullable: true}) title: String;
  @Column({nullable: true}) textContent: String;

  @Column({nullable: true}) pictureSource: number;
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
  @JoinColumn({name:"list.id"})
  list: List;

  constructor() {

  }

}
