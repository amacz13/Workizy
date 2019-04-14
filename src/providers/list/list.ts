import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ListItem} from "../list-item/list-item";

@Entity('list')
export class List {

  // Unique ID for storage purposes
  @PrimaryGeneratedColumn()
  id: number;

  // List details
  @Column()
  title: String;
  @Column()
  cover: String;

  // Date informations
  @Column()
  creationDate: number;
  @Column()
  lastEditionDate: number;

  @Column()
  isSynchronized: boolean;

  @OneToMany(type => ListItem, item => item.list)
  items: ListItem[];

  constructor() {
  }
}
