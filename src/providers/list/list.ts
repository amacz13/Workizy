import {Column, Entity, JoinTable, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique} from "typeorm";
import {ListItem} from "../list-item/list-item";

@Entity('list')
export class List {

  // Unique ID for storage purposes
  @PrimaryColumn() id: String;
  @PrimaryColumn() firebaseId: String;

  // List details
  @Column() title: String;
  @Column() coverSource: number;
  @Column() cover: String;
  @Column() listType: String;

  // Date informations
  @Column() creationDate: number;
  @Column() lastEditionDate: number;

  @Column() isSynchronized: boolean;

  @OneToMany(type => ListItem, item => item.list, {
    onDelete: 'CASCADE'
  })
  @JoinTable()
  items: ListItem[];

  getElementCount() {
    return this.items.length;
  }

  constructor() {
  }
}
