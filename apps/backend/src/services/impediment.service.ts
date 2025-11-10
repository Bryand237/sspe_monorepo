import { FindManyOptions, Repository } from "typeorm";
import { Impediment } from "../entity/impediment";
import { AppDataSource } from "../data/data-source";

export class ImpedimentService {
  private impedimentRepository: Repository<Impediment>;

  constructor() {
    this.impedimentRepository = AppDataSource.getRepository(Impediment);
  }

  async getAllImpedimentNumber(options?: FindManyOptions): Promise<number> {
    return await this.impedimentRepository.count(options);
  }

  async getAllImpediment(): Promise<Impediment[]> {
    return await this.impedimentRepository.find({
      order: { createdAt: "DESC" },
      relations: ["teacherId", "doc"]
    });
  }

  async getImpedimentById(id: string): Promise<Impediment | null> {
    return await this.impedimentRepository.findOne({ 
      where: { id },
      relations: ["teacherId", "doc"]
    });
  }

  async createImpediment(impData: Partial<Impediment>): Promise<Impediment> {
    const newImp = this.impedimentRepository.create(impData);
    return await this.impedimentRepository.save(newImp);
  }

  async updateImpediment(
    id: string,
    impData: Partial<Impediment>
  ): Promise<Impediment | null> {
    await this.impedimentRepository.update(id, impData);
    return this.getImpedimentById(id);
  }

  async deleteImpediment(id: string): Promise<boolean> {
    const result = await this.impedimentRepository.delete(id);
    return result.affected !== 0;
  }

  async searchImpediment(q: string | Date): Promise<Impediment[]> {
    return await this.impedimentRepository
      .createQueryBuilder("impediment")
      .where(
        `impediment.teacherId = :query OR impediment.type = :query OR impediment.startDate = :query`,
        { query: `%${q}%` }
      )
      .getMany();
  }
}
