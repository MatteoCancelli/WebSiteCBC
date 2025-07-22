import express from "express";
import { mostraHome, mostraCorso, mostraInsegnante, mostraContatti, inviaIscrizione } from "../controllers/accademiaController.js";

const router = express.Router();

router.get("/", mostraHome);
router.get("/corso", mostraCorso);
router.get("/insegnante", mostraInsegnante);
router.get("/contatti", mostraContatti);
router.post("/invia-iscrizione", inviaIscrizione);

export default router;