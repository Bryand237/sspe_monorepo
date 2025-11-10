import { DocService } from "../services/docs.service";
import { catchError } from "../utils/catchError";
import { Document } from "../entity/docs";
import { CREATED, OK } from "../constants/http";
import appAssert from "../utils/appAssert";

export class DocController {
  private docService: DocService;

  constructor() {
    this.docService = new DocService();
  }

  getAllDocsNumber = catchError(async (req, res) => {
    const number = await this.docService.getAllDocsNumber({
      where: {
        teacher: undefined,
        impId: undefined,
        adv: undefined,
      },
    });
    res.status(OK).json({
      success: true,
      number,
    });
  });

  getAllDocs = catchError(async (req, res) => {
    const docs = await this.docService.getAllDocs({
      order: { docName: "ASC" },
      where: {
        teacher: undefined,
        impId: undefined,
        adv: undefined,
      },
    });
    res.status(OK).json({
      success: true,
      data: docs,
    });
  });

  getDocById = catchError(async (req, res) => {
    const id = req.params.id;
    const doc = await this.docService.getDocById(id);
    res.status(OK).json({
      success: true,
      data: doc,
    });
  });

  getDocByName = catchError(async (req, res) => {
    const { docName } = req.body;
    const doc = await this.docService.getDocByName(docName);
    res.status(OK).json({
      success: true,
      data: doc,
    });
  });

  createDoc = catchError(async (req, res) => {
    // const docName = req.file?.filename;
    // const docPath = req.file?.path;
    // const docsize = req.file?.size;

    // debug utile pendant dev
    // console.log("multer file:", req.file);

    console.log("multer file:", req.file); // debug
    const file = req.file;
    if (!file) {
      appAssert(true, 400, "Fichier non téléchargé");
      return;
    }

    const docName = file.filename;
    const docPath = `/globals/${file.filename}`;
    const docSize = file.size;

    const newDoc = await this.docService.saveDoc({
      docName,
      docPath,
      docsize: docSize, // la colonne DB s'appelle docsize
    });

    res.status(CREATED).json({
      success: true,
      data: newDoc,
      message: "Document ajouté avec succès.",
    });
  });

  deleteDoc = catchError(async (req, res) => {
    const id = req.params.id;
    await this.docService.deleteDoc(id);
    res.status(OK).json({
      success: true,
      message: "Document supprimé avec succès.",
    });
  });
}
