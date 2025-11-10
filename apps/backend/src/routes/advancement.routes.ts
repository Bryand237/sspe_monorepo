import { Router } from "express";
import { AdvancementController } from "../controllers/advancement.controller";
import { uploadAdvancement } from "../middlewares/multer.advancement";

const advancementRouter: Router = Router();
const advancementController = new AdvancementController();

advancementRouter.get(
  "/number",
  advancementController.getAllAdvancementsNumber
);
advancementRouter.post(
  "/generate-pdf",
  advancementController.generateAdvancementPDF
);
advancementRouter.post(
  "/test-pdf",
  advancementController.testGeneratePDF
);
advancementRouter.get("/", advancementController.getAllAdvancements);
advancementRouter.get("/:id", advancementController.getAdvancementById);
advancementRouter.post(
  "/",
  uploadAdvancement.single("file"),
  advancementController.createAdvancement
);
advancementRouter.put("/:id", advancementController.updateAdvancement);
advancementRouter.delete("/:id", advancementController.deleteAdvancement);

export default advancementRouter;
