import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { readFileSync } = fs;

export const mostraHome = (req, res) => {
  res.render("banda/index", {
    title: "Corpo Bandistico di Castelcovati",
    head: "partials/head-banda",
    navbar: "partials/navbar-banda",
  });
};

export const mostraEventi = (req, res) => {
  res.render("banda/eventi", {
    title: "Eventi",
    head: "partials/head-banda",
    navbar: "partials/navbar-banda",
  });
};

export const mostraPartner = (req, res) => {
const dataPath = path.join(__dirname, "../data/partner.json");
const rawData = fs.readFileSync(dataPath);
const partners = JSON.parse(rawData);

  const tiers = [
    "Istituzioni",
    "Main Partner",
    "Platinum Partner",
    "Gold Partner",
    "Silver Partner",
    "Bronze Partner",
  ];
  const partnerByTier = {};

  tiers.forEach((tier) => {
    partnerByTier[tier] = partners.filter((p) => p.tier === tier);
  });

  res.render("banda/partner", {
    title: "Partner",
    head: "partials/head-banda",
    navbar: "partials/navbar-banda",
    partnerByTier,
  });
};

export const mostraContatti = (req, res) => {

  res.render("banda/contatti", {
    title: "Contatti",
    head: "partials/head-banda",
    navbar: "partials/navbar-banda",
  });
};

export const mostraDona = (req, res) => {
  res.render("banda/dona", {
    title: "Fai una Donazione",
    head: "partials/head-banda",
    navbar: "partials/navbar-banda",
  });
};

export const mostraChiSiamo = (req, res) => {
  res.render("banda/chiSiamo", {
    title: "Chi Siamo",
    head: "partials/head-banda",
    navbar: "partials/navbar-banda",
  });
};
export const mostraStoria = (req, res) => {
  res.render("banda/storia", {
    title: "La nostra Storia",
    head: "partials/head-banda",
    navbar: "partials/navbar-banda",
  });
};
export const mostraDirettore = (req, res) => {
  const direttorePath = path.join(__dirname, "../data/direttoreArtistico.json");
  const direttore = JSON.parse(readFileSync(direttorePath));

  res.render("banda/direttore", {
    title: "Il Direttore Artistico",
    head: "partials/head-banda",
    navbar: "partials/navbar-banda",
    direttore,
  });
};

export const mostraConsiglio = (req, res) => {
  const direttivoPath = path.join(__dirname, "../data/direttivo.json");
  const direttivo = JSON.parse(readFileSync(direttivoPath));

  res.render("banda/consiglio", {
    title: "Consiglio Direttivo",
    head: "partials/head-banda",
    navbar: "partials/navbar-banda",
    direttivo,
  });
};
