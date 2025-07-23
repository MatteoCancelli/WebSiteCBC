import express from "express";
import { mostraHome, mostraContatti, mostraPartner } from "../controllers/bandaController.js";

const router = express.Router();

router.get("/", mostraHome);
router.get("/contatti", mostraContatti);
router.get("/partner", mostraPartner);

export default router;