import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Teacher } from "./teacher";
import { Advancement } from "./advancement";
import { Impediment } from "./impediment";

@Entity()
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.docs)
  teacher?: Teacher;

  @OneToOne(() => Advancement, (adv) => adv.doc)
  adv?: Advancement;

  @OneToOne(() => Impediment, (imp) => imp.doc)
  impId?: Impediment;

  @Column({ type: "varchar", length: 255 })
  docName!: string;

  @Column({ type: "varchar", length: 255 })
  docPath!: string;

  @Column({ type: "float" })
  docsize!: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
