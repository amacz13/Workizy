import {ListItem} from "../list-item/list-item";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity('link')
export class Link {

  // Unique ID for storage purposes
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => ListItem, listItem => listItem.links, {
    cascade: ['insert'], onDelete: 'CASCADE'
  }) item: ListItem;

  @Column() content: String;

  constructor() {
  }

}
