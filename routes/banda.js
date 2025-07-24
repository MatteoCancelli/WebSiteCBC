import express from "express";
import { mostraHome, mostraContatti, mostraPartner, mostraDona } from "../controllers/bandaController.js";

const router = express.Router();

router.get("/", mostraHome);
router.get("/contatti", mostraContatti);
router.get("/partner", mostraPartner);
router.get("/dona", mostraDona);

export default router;