import { FindManyOptions, Repository } from "typeorm";
import { Teacher } from "../entity/teacher";
import { AppDataSource } from "../data/data-source";

export class TeacherService {
  private teacherRepository: Repository<Teacher>;

  constructor() {
    this.teacherRepository = AppDataSource.getRepository(Teacher);
  }

  async getAllTeacherNumber(options?: FindManyOptions): Promise<number> {
    return await this.teacherRepository.count(options);
  }

  async getAllTeacher(): Promise<Teacher[]> {
    return await this.teacherRepository.find({ 
      order: { firstname: "ASC" },
      relations: ["institution", "docs", "impediments", "advancements"]
    });
  }

  async getTeacherById(id: string): Promise<Teacher | null> {
    return await this.teacherRepository.findOne({ 
      where: { id },
      relations: ["institution", "docs", "impediments", "advancements"]
    });
  }

  async createTeacher(teacherData: Partial<Teacher>): Promise<Teacher> {
    const newTeacher = this.teacherRepository.create(teacherData);
    return await this.teacherRepository.save(newTeacher);
  }

  async updateTeacher(
    id: string,
    newTeacher: Partial<Teacher>
  ): Promise<Teacher | null> {
    await this.teacherRepository.update(id, newTeacher);
    return this.getTeacherById(id);
  }

  async deleteTeacher(id: string): Promise<boolean> {
    const result = await this.teacherRepository.delete(id);
    return result.affected !== 0;
  }

  async searchTeacher(q: string | Date): Promise<Teacher[]> {
    return await this.teacherRepository
      .createQueryBuilder("teacher")
      .where(``, { query: `%${q}%` })
      .getMany();
  }

  async archiveTeacher(id: string): Promise<void> {
    const teacher = await this.getTeacherById(id);
    if (teacher) {
      await this.updateTeacher(id, { ...teacher, statut: "archivé" });
    }
  }
}
