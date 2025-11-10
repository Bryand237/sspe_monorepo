import { FindManyOptions, Repository } from "typeorm";
import { Document } from "../entity/docs";
import { AppDataSource } from "../data/data-source";

export class DocService {
  private docRepository: Repository<Document>;

  constructor() {
    this.docRepository = AppDataSource.getRepository(Document);
  }

  async getAllDocsNumber(options?: FindManyOptions): Promise<number> {
    return await this.docRepository.count(options);
  }

  async getAllDocs(options?: FindManyOptions): Promise<Document[]> {
    return await this.docRepository.find(options);
  }

  async getDocById(id: string): Promise<Document | null> {
    return await this.docRepository.findOneBy({ id });
  }

  async getDocByName(docName: string): Promise<Document | null> {
    return await this.docRepository.findOneBy({ docName });
  }

  async saveDoc(docData: Partial<Document>): Promise<Document> {
    const newDoc = this.docRepository.create(docData);
    return await this.docRepository.save(newDoc);
  }

  async deleteDoc(id: string): Promise<boolean> {
    const result = await this.docRepository.delete(id);
    return result.affected !== 0;
  }

  async searchDoc(q: string): Promise<Document[]> {
    return await this.docRepository
      .createQueryBuilder("doc")
      .where(`doc.docName LIKE :query`, {
        query: `%${q}%`,
      })
      .getMany();
  }
}
