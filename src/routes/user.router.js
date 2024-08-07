import { Router } from "express";
import { addProfileImg, getImageById } from "../controller/user.controller.js";
import multer from "multer";
import { storage } from "../utils/utils.js";

const router = Router();

const upload = multer({ storage: storage });

router.put("/addImage", upload.single("profileImage"), addProfileImg);
router.get("/getImage/:id", getImageById);

export default router;
