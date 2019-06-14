import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {ListItem} from "../list-item/list-item";

@Entity('list')
@Unique(["firebaseId"])
export class List {

  // Unique ID for storage purposes
  @PrimaryGeneratedColumn() id: number;
  @Column({nullable: true}) firebaseId: String;

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
    nullable: true,
    onDelete: 'CASCADE'
  })
  items: ListItem[];

  getElementCount() {
    return this.items.length;
  }

  constructor() {
  }
}
