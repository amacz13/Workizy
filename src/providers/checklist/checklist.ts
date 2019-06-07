import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {ListItem} from "../list-item/list-item";
import {ChecklistItem} from "../checklist-item/checklist-item";

@Entity('checklist')
export class Checklist {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: String;

  @OneToMany(type => ChecklistItem, item => item.checklist)
  items: ChecklistItem[];

  @OneToOne(type => ListItem, item => item.checklist, {
    cascade: ['insert']
  })
  listItem: ListItem;

  constructor() {

  }

}
