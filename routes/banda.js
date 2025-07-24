import express from "express";
import {
  mostraHome,
  mostraContatti,
  mostraPartner,
  mostraDona,
  mostraChiSiamo,
  mostraStoria,
  mostraDirettore,
  mostraConsiglio,
} from "../controllers/bandaController.js";

const router = express.Router();

router.get("/", mostraHome);
router.get("/contatti", mostraContatti);
router.get("/partner", mostraPartner);
router.get("/dona", mostraDona);
router.get("/chiSiamo", mostraChiSiamo);
router.get("/storia", mostraStoria);
router.get("/direttore", mostraDirettore);
router.get("/consiglio", mostraConsiglio);

export default router;
