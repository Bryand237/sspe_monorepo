import { Router } from "express";
import { InstitutionController } from "../controllers/institution.controller";

const institutionRouter: Router = Router();
const institutionController = new InstitutionController();

institutionRouter.get(
  "/number",
  institutionController.getAllInstitutionsNumber
);
institutionRouter.get("/", institutionController.getAllInstitutions);
institutionRouter.get("/:id", institutionController.getInstitutionById);
institutionRouter.post("/", institutionController.createInstitution);
institutionRouter.put("/:id", institutionController.updateInstitution);
institutionRouter.delete("/:id", institutionController.deleteInstitution);

export default institutionRouter;
