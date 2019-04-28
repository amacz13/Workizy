import {Checklist} from "../checklist/checklist";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity('checklistitem')
export class ChecklistItem {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: String;
  @Column()
  isChecked : boolean;

  @ManyToOne(type => Checklist, cl => cl.items, {
    cascade: ['insert']
  })
  checklist: Checklist;

  constructor() {
  }

}
