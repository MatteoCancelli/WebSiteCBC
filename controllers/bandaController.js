import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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