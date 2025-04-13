import express from "express";
import { mostraHome, mostraEventi } from "../controllers/bandaController.js";

const router = express.Router();

router.get("/", mostraHome);
router.get("/eventi", mostraEventi);

export default router;