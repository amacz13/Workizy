import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ListItem} from "../list-item/list-item";

@Entity('checklistitem')
export class ChecklistItem {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: String;
  @Column()
  isChecked : boolean;

  @ManyToOne(type => ListItem, cl => cl.checklistitems, {
    cascade: ['insert'], onDelete: 'CASCADE'
  })
  listitem: ListItem;

  constructor() {
  }

}
