import { FindManyOptions, Repository } from "typeorm";
import { Advancement } from "../entity/advancement";
import { AppDataSource } from "../data/data-source";

export class AdvancementService {
  private advRepository: Repository<Advancement>;

  constructor() {
    this.advRepository = AppDataSource.getRepository(Advancement);
  }

  async getAllAdvancementNumber(options?: FindManyOptions): Promise<number> {
    return await this.advRepository.count(options);
  }

  async getAllAdvancement(): Promise<Advancement[]> {
    return await this.advRepository.find({ 
      order: { createdAt: "DESC" },
      relations: ["teachersList", "doc"]
    });
  }

  async getAdvancementById(id: string): Promise<Advancement | null> {
    return await this.advRepository.findOne({ 
      where: { id },
      relations: ["teachersList", "teachersList.institution", "doc"]
    });
  }

  async createAdvancement(advData: Partial<Advancement>): Promise<Advancement> {
    const newAdv = this.advRepository.create(advData);
    return await this.advRepository.save(newAdv);
  }

  async updateAdvancement(
    id: string,
    advData: Partial<Advancement>
  ): Promise<Advancement | null> {
    await this.advRepository.update(id, advData);
    return this.getAdvancementById(id);
  }

  async deleteAdvancement(id: string): Promise<boolean> {
    const result = await this.advRepository.delete(id);
    return result.affected !== 0;
  }

  async searchAdvancement(q: Date): Promise<Advancement[]> {
    return await this.advRepository
      .createQueryBuilder("advancement")
      .where(`advancement.startDate = :query`, {
        query: `%${q}%`,
      })
      .getMany();
  }
}
