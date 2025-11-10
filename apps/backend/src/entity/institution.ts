import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Teacher } from "./teacher";

@Entity()
export class Institution {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  fullname!: string;

  @Column({ type: "varchar", length: 10 })
  abbreviation!: string;

  @Column()
  type!: "école" | "faculté";

  @Column({ type: "varchar", length: 255 })
  host!: string;

  @OneToMany(() => Teacher, (teacher) => teacher.institution, {
    onDelete: "CASCADE",
  })
  teachers?: Teacher[];

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
