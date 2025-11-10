import { CREATED, OK } from "../constants/http";
import { Institution } from "../entity/institution";
import { InstitutionService } from "../services/institution.service";
import { catchError } from "../utils/catchError";

export class InstitutionController {
  private institutionService: InstitutionService;

  constructor() {
    this.institutionService = new InstitutionService();
  }

  getAllInstitutionsNumber = catchError(async (req, res) => {
    const number = await this.institutionService.getAllInstitutionNumber();
    res.status(OK).json({
      success: true,
      number,
    });
  });

  getAllInstitutions = catchError(async (req, res) => {
    const institutions = await this.institutionService.getAllInstitution();
    res.status(OK).json({
      success: true,
      data: institutions,
    });
  });

  getInstitutionById = catchError(async (req, res) => {
    const id = req.params.id;
    const institution = await this.institutionService.getInstitutionById(id);
    res.status(OK).json({
      success: true,
      data: institution,
    });
  });

  createInstitution = catchError(async (req, res) => {
    const instData: Partial<Institution> = req.body;
    const newInstitution = await this.institutionService.createInstitution(
      instData
    );
    res.status(CREATED).json({
      success: true,
      data: newInstitution,
      message: "Institution enregistrée avec succès.",
    });
  });

  updateInstitution = catchError(async (req, res) => {
    const id = req.params.id;
    const instData: Partial<Institution> = req.body;
    const updateInstitution = await this.institutionService.updateInstitution(
      id,
      instData
    );
    res.status(OK).json({
      success: true,
      data: updateInstitution,
      message: "Institution modifiée avec succès.",
    });
  });

  deleteInstitution = catchError(async (req, res) => {
    const id = req.params.id;
    await this.institutionService.deleteInstitution(id);
    res.status(OK).json({
      success: true,
      message: "Institution supprimée avec succès.",
    });
  });
}
