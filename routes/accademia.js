import express from "express";
import { mostraHome, mostraCorsi } from "../controllers/accademiaController.js";

const router = express.Router();

router.get("/", mostraHome);
router.get("/corsi", mostraCorsi);

export default router;