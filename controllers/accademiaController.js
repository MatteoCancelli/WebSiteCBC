import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import SibApiV3Sdk from "@getbrevo/brevo";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mostraHome = (req, res) => {
  const dataPath = path.join(__dirname, "../data/feedbackAccademia.json");
  const feedback = JSON.parse(readFileSync(dataPath));
  res.render("accademia/index", {
    title: "Accademia Musicale",
    head: "partials/head-accademia",
    navbar: "partials/navbar-accademia",
    bodyClass: "",
    feedback,
  });
};

export const mostraSceltaCorsi = (req, res) => {
  res.render("accademia/sceltaCorsi", {
    title: "Scelta Corsi",
    head: "partials/head-accademia",
    navbar: "partials/navbar-accademia",
    bodyClass: "",
  });
};

export const mostraCorso = (req, res) => {
  const id = req.query.id;
  const corsiPath = path.join(__dirname, "../data/corsi.json");
  const insegnantiPath = path.join(__dirname, "../data/insegnanti.json");

  const corsi = JSON.parse(readFileSync(corsiPath));
  const insegnanti = JSON.parse(readFileSync(insegnantiPath));

  const corso = corsi.find((c) => c.tag === id);
  if (!corso) return res.status(404).render("404");

  // Mappa tag → oggetti insegnanti
  const insegnantiCorso = corso.insegnanti.map((tag) =>
    insegnanti.find((i) => i.tag === tag)
  );

  res.render("accademia/corso", {
    corso,
    insegnanti: insegnantiCorso,
    title: corso.titolo,
    head: "partials/head-accademia",
    navbar: "partials/navbar-accademia",
    bodyClass: "",
  });
};

export const mostraInsegnante = (req, res) => {
  const id = req.query.id;
  const insegnantiPath = path.join(__dirname, "../data/insegnanti.json");
  const corsiPath = path.join(__dirname, "../data/corsi.json");

  const insegnanti = JSON.parse(readFileSync(insegnantiPath));
  const corsi = JSON.parse(readFileSync(corsiPath));

  const insegnante = insegnanti.find((i) => i.tag === id);
  if (!insegnante) return res.status(404).render("404");

  const corsiInsegnante = corsi.filter((c) => insegnante.corsi.includes(c.tag));

  res.render("accademia/insegnante", {
    insegnante,
    corsiInsegnante,
    title: insegnante.nome,
    head: "partials/head-accademia",
    navbar: "partials/navbar-accademia",
    bodyClass: "",
  });
};

export const mostraContatti = (req, res) => {
  const corsiPath = path.join(__dirname, "../data/corsi.json");
  const corsi = JSON.parse(readFileSync(corsiPath));

  res.render("accademia/contatti", {
    title: "Contatti e Iscrizioni",
    head: "partials/head-accademia",
    navbar: "partials/navbar-accademia",
    bodyClass: "",
    corsi,
  });
};

export const inviaIscrizione = async (req, res) => {
  const { nome, email, telefono, note, corsi } = req.body;
  const corsiSelezionati = Array.isArray(corsi) ? corsi.join(", ") : corsi;

  // Crea direttamente l'istanza dell'API
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Imposta l'API Key
  apiInstance.apiClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

  const sendSmtpEmail = {
    sender: { email: process.env.BREVO_USER, name: "Iscrizione Accademia" },
    to: [{ email: process.env.EMAIL_USER }],
    subject: "Nuova richiesta di iscrizione",
    htmlContent: `
      <h2>Nuova Iscrizione</h2>
      <p><b>Nome:</b> ${nome}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Telefono:</b> ${telefono}</p>
      <p><b>Corsi selezionati:</b> ${corsiSelezionati}</p>
      <p><b>Note aggiuntive:</b> ${note || "Nessuna"}</p>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.render("accademia/contatti", {
      title: "Contatti e Iscrizioni",
      head: "partials/head-accademia",
      navbar: "partials/navbar-accademia",
      bodyClass: "",
      success: true,
      corsi: JSON.parse(readFileSync(path.join(__dirname, "../data/corsi.json"))),
    });
  } catch (error) {
    console.error("Errore invio email:", error);
    res.render("accademia/contatti", {
      title: "Contatti e Iscrizioni",
      head: "partials/head-accademia",
      navbar: "partials/navbar-accademia",
      bodyClass: "",
      success: false,
      corsi: JSON.parse(readFileSync(path.join(__dirname, "../data/corsi.json"))),
    });
  }
};

export const mostraInsegnanti = (req, res) => {
  const dataPath = path.join(__dirname, "../data/insegnanti.json");
  const insegnanti = JSON.parse(readFileSync(dataPath));
  res.render("accademia/insegnanti", {
    insegnanti,
    title: "I nostri insegnanti",
    head: "partials/head-accademia",
    navbar: "partials/navbar-accademia",
    bodyClass: "",
  });
};
