import { FindManyOptions, Repository } from "typeorm";
import { Institution } from "../entity/institution";
import { AppDataSource } from "../data/data-source";

export class InstitutionService {
  private institutionRepository: Repository<Institution>;

  constructor() {
    this.institutionRepository = AppDataSource.getRepository(Institution);
  }

  async getAllInstitutionNumber(options?: FindManyOptions): Promise<number> {
    return await this.institutionRepository.count(options);
  }

  async getAllInstitution(): Promise<Institution[]> {
    return await this.institutionRepository.find({
      order: { fullname: "ASC" },
      relations: ["teachers"]
    });
  }

  async getInstitutionById(id: string): Promise<Institution | null> {
    return await this.institutionRepository.findOne({ 
      where: { id },
      relations: ["teachers"]
    });
  }

  async createInstitution(
    instData: Partial<Institution>
  ): Promise<Institution | null> {
    const newIst = this.institutionRepository.create(instData);
    return await this.institutionRepository.save(newIst);
  }

  async updateInstitution(
    id: string,
    newInst: Partial<Institution>
  ): Promise<Institution | null> {
    await this.institutionRepository.update(id, newInst);
    return await this.getInstitutionById(id);
  }

  async deleteInstitution(id: string): Promise<boolean> {
    const result = await this.institutionRepository.delete(id);
    return result.affected !== 0;
  }

  async searchInstitution(q: string): Promise<Institution[]> {
    return await this.institutionRepository
      .createQueryBuilder("inst")
      .where(
        `inst.fullname LIKE :query OR inst.abbreviation LIKE :query OR inst.type LIKE :query OR inst.host LIKE :query`,
        { query: `%${q}%` }
      )
      .getMany();
  }
}
