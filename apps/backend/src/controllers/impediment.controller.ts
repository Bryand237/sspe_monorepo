import { CREATED, OK } from "../constants/http";
import { Impediment } from "../entity/impediment";
import { DocService } from "../services/docs.service";
import { ImpedimentService } from "../services/impediment.service";
import { catchError } from "../utils/catchError";

export class ImpedimentController {
  private impedimentService: ImpedimentService;
  private docService: DocService;

  constructor() {
    this.impedimentService = new ImpedimentService();
    this.docService = new DocService();
  }

  getAllImpedimentNumber = catchError(async (req, res) => {
    const number = await this.impedimentService.getAllImpedimentNumber();
    res.status(OK).json({
      success: true,
      number,
    });
  });

  getAllImpediments = catchError(async (req, res) => {
    const impediments = await this.impedimentService.getAllImpediment();
    res.status(OK).json({
      success: true,
      data: impediments,
    });
  });

  getImpedimentById = catchError(async (req, res) => {
    const id = req.params.id;
    const impediment = await this.impedimentService.getImpedimentById(id);
    res.status(OK).json({
      success: true,
      data: impediment,
    });
  });

  createImpediment = catchError(async (req, res) => {
    const impData: Partial<Impediment> = req.body;
    const docName = req.file?.filename;
    const docPath = req.file?.path;

    const newDoc = await this.docService.saveDoc({ docName, docPath });
    impData.doc = newDoc;
    const newImpediment = await this.impedimentService.createImpediment(
      impData
    );
    res.status(CREATED).json({
      success: true,
      data: newImpediment,
      message: "Empêchement enregistré avec succès.",
    });
  });

  updateImpediment = catchError(async (req, res) => {
    const id = req.params.id;
    const impData: Partial<Impediment> = req.body;
    const updatedImpediment = await this.impedimentService.updateImpediment(
      id,
      impData
    );
    res.status(OK).json({
      success: true,
      data: updatedImpediment,
      message: "Empêchement modifié avec succès.",
    });
  });

  deleteImpediment = catchError(async (req, res) => {
    const id = req.params.id;
    await this.impedimentService.deleteImpediment(id);
    res.status(OK).json({
      success: true,
      message: "Empêchement supprimé avec succès.",
    });
  });
}
