import express from "express";
import { mostraHome, mostraCorso } from "../controllers/accademiaController.js";

const router = express.Router();

router.get("/", mostraHome);
router.get("/corso", mostraCorso);
// router.get("/insegnante", mostraInsegnante);

export default router;