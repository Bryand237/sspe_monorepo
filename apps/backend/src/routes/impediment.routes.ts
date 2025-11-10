import { Router } from "express";
import { ImpedimentController } from "../controllers/impediment.controller";
import { uploadImpediment } from "../middlewares/multer.impediment";

const impdimentRouter: Router = Router();
const impedimentController = new ImpedimentController();

impdimentRouter.get("/number", impedimentController.getAllImpedimentNumber);
impdimentRouter.get("/", impedimentController.getAllImpediments);
impdimentRouter.get("/:id", impedimentController.getImpedimentById);
impdimentRouter.post(
  "/",
  uploadImpediment.single("file"),
  impedimentController.createImpediment
);
impdimentRouter.put("/:id", impedimentController.updateImpediment);
impdimentRouter.delete("/:id", impedimentController.deleteImpediment);

export default impdimentRouter;
