import { Router } from "express";
import { addImage, getAllUserImages } from "../controller/image.controller.js";

const router = Router();

router.post("/addImage", addImage);
router.get("/getAllUserImages/:id", getAllUserImages);

export default router;
