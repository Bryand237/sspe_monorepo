import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Teacher } from "./teacher";
import { Document } from "./docs";

@Entity()
export class Advancement {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => Document, (doc) => doc.adv)
  @JoinColumn()
  doc!: Document;

  // Relation plusieur à plusieurs (Many-to-Many)
  @ManyToMany(() => Teacher, (teacher) => teacher.advancements, {
    onDelete: "CASCADE",
  })
  @JoinTable({
    name: "teacher_adv",
    joinColumn: { name: "advancementId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "teacherId", referencedColumnName: "id" },
  })
  teachersList?: Teacher[];

  @Column({ type: "int" })
  numberOfTeacher!: number;

  @Column({ type: "datetime" })
  startDate!: Date;

  @Column({ type: "datetime" })
  endDate!: Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
