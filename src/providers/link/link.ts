import {ListItem} from "../list-item/list-item";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity('link')
export class Link {

  // Unique ID for storage purposes
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => ListItem, listItem => listItem.links, {
    cascade: ['insert']
  }) item: ListItem;

  @Column() content: String;

  constructor() {
  }

}
