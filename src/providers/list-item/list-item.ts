import {Checklist} from "../checklist/checklist";
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {List} from "../list/list";

@Entity('listitem')
export class ListItem {

  // Unique ID for storage purposes
  @PrimaryGeneratedColumn()
  id: number;

  // Content of the item
  @Column({nullable: true})
  title: String;
  @Column({nullable: true})
  textContent: String;
  @Column({nullable: true})
  picture: String;
  @OneToOne(type => Checklist, cl => cl.listItem, {
    nullable: true
  })
  @JoinColumn()
  checklist: Checklist;

  // Date informations
  @Column()
  creationDate: number;
  @Column()
  lastEditionDate: number;
  @Column({nullable: true})
  reminderDate: number;

  @ManyToOne(type => List, list => list.items, {
    cascade: ['insert']
  })
  list: List;

  constructor() {

  }

}
