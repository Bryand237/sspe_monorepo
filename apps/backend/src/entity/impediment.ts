import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Teacher } from "./teacher";
import { Document } from "./docs";

@Entity()
export class Impediment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => Document, (doc) => doc.impId)
  @JoinColumn()
  doc!: Document;

  @ManyToOne(() => Teacher, (teacher) => teacher.impediments)
  teacherId!: Teacher;

  @Column()
  type!: "mission" | "congé de maternité";

  @Column({ type: "datetime" })
  startDate!: Date;

  @Column({ type: "datetime" })
  endDate!: Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
