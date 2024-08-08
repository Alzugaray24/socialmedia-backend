import { Router } from "express";
import { addProfileImg, getImageById } from "../controller/user.controller.js";

const router = Router();

router.put("/addProfileImg", addProfileImg);
router.get("/getImage/:id", getImageById);

export default router;
