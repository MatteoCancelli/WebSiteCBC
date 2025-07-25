import express from "express";
import { mostraHome, mostraCorso, mostraInsegnante, mostraContatti, inviaIscrizione, mostraInsegnanti } from "../controllers/accademiaController.js";

const router = express.Router();

router.get("/", mostraHome);
router.get("/corso", mostraCorso);
router.get("/insegnante", mostraInsegnante);
router.get("/contatti", mostraContatti);
router.post("/invia-iscrizione", inviaIscrizione);
router.get("/insegnanti", mostraInsegnanti);

export default router;