import { Router } from "express";
import { DocController } from "../controllers/docs.controller";
import { uploadGlobal } from "../middlewares/multer.doc";

const docRouter: Router = Router();
const docController = new DocController();

docRouter.get("/number", docController.getAllDocsNumber);
docRouter.get("/", docController.getAllDocs);
docRouter.get("/name", docController.getDocByName);
docRouter.get("/:id", docController.getDocById);
docRouter.post("/", uploadGlobal.single("file"), docController.createDoc);
docRouter.delete("/:id", docController.deleteDoc);

export default docRouter;
