import { Router } from "express";
import {
  addImage,
  getAllUserImages,
  deleteImage,
} from "../controller/image.controller.js";

const router = Router();

router.post("/addImage", addImage);
router.get("/getAllUserImages/:id", getAllUserImages);
router.delete("/deleteImage/:imageId", deleteImage);

export default router;
