import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Advancement } from "./advancement";
import { Impediment } from "./impediment";
import { Document } from "./docs";
import { Institution } from "./institution";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 10, unique: true })
  matricule!: string;

  @Column({ type: "varchar", length: 255 })
  firstname!: string;

  @Column({ type: "varchar", length: 255 })
  lastname!: string;

  @Column({ type: "datetime" })
  hireDate!: Date;

  @Column({ type: "datetime" })
  birthdate!: Date;

  @Column({ type: "varchar", length: 255 })
  functions!: string;

  @Column({ type: "varchar", length: 10 })
  sex!: "Masculin" | "Feminin";

  @Column({ type: "varchar", length: 255 })
  lastDiploma!: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "bigint" })
  phone!: string;

  @ManyToOne(() => Institution, (inst) => inst.teachers)
  institution!: Institution;

  @Column({ type: "varchar", length: 255 })
  grade!:
    | "Professeur"
    | "Maitre de Conférence"
    | "Chargé de cours"
    | "Assistant Sans Thèse"
    | "Assistant Avec Thèse";

  @Column({ type: "varchar", length: 255 })
  cei!: string;

  @Column({ type: "datetime" })
  lastAdvancementDate!: Date;

  @Column({ type: "varchar", length: 255 })
  nextGrade!:
    | "Professeur"
    | "Maitre de Conférence"
    | "Chargé de cours"
    | "Assistant Sans Thèse"
    | "Assistant Avec Thèse";

  @Column({ type: "varchar", length: 255 })
  nextCei!: string;

  @Column({ type: "datetime" })
  nextAdvancementDate!: Date;

  @OneToMany(() => Document, (doc) => doc.teacher, {
    onDelete: "CASCADE",
  })
  docs?: Document[];

  @ManyToMany(() => Advancement, (adv) => adv.teachersList)
  advancements?: Advancement[];

  @OneToMany(() => Impediment, (imp) => imp.teacherId, {
    onDelete: "CASCADE",
  })
  impediments?: Impediment[];

  @Column({ type: "varchar", length: 255 })
  statut!: "actif" | "archivé";

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
