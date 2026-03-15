import express from "express";
import { mostraHome, mostraSceltaCorsi, mostraCorso, mostraInsegnante, mostraContatti, inviaIscrizione, mostraInsegnanti, mostraMasterclass, inviaIscrizioneMasterclass } from "../controllers/accademiaController.js";

const router = express.Router();

router.get("/", mostraHome);
router.get("/sceltaCorsi", mostraSceltaCorsi);
router.get("/corso", mostraCorso);
router.get("/insegnante", mostraInsegnante);
router.get("/contatti", mostraContatti);
router.post("/invia-iscrizione", inviaIscrizione);
router.get("/insegnanti", mostraInsegnanti);
router.get("/masterclass", mostraMasterclass);
router.post("/masterclass/iscriviti", inviaIscrizioneMasterclass);

export default router;