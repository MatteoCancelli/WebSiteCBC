import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mostraHome = (req, res) => {
  res.render("accademia/index", {
    title: "Accademia Musicale",
    navbar: "partials/navbar-accademia",
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
    navbar: "partials/navbar-accademia",
  });
};

export const mostraInsegnante = (req, res) => {
  const id = req.query.id;
  const dataPath = path.join(__dirname, "../data/insegnanti.json");
  const insegnanti = JSON.parse(readFileSync(dataPath));

  const insegnante = insegnanti.find((i) => i.tag === id);

  if (!insegnante) return res.status(404).render("404");

  res.render("accademia/insegnante", {
    insegnante,
    title: insegnante.nome,
    navbar: "partials/navbar-accademia",
  });
};

export const mostraContatti = (req, res) => {
  const corsiPath = path.join(__dirname, "../data/corsi.json");
  const corsi = JSON.parse(readFileSync(corsiPath));

  res.render("accademia/contatti", {
    title: "Contatti e Iscrizioni",
    navbar: "partials/navbar-accademia",
    corsi,
  });
};

export const inviaIscrizione = async (req, res) => {
  const { nome, email, telefono, note, corsi } = req.body;

  const corsiSelezionati = Array.isArray(corsi) ? corsi.join(", ") : corsi;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // oppure smtp.yourdomain.com
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Iscrizione Accademia" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "Nuova richiesta di iscrizione",
    html: `
      <h2>Nuova Iscrizione</h2>
      <p><b>Nome:</b> ${nome}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Telefono:</b> ${telefono}</p>
      <p><b>Corsi selezionati:</b> ${corsiSelezionati}</p>
      <p><b>Note aggiuntive:</b> ${note || "Nessuna"}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render("accademia/contatti", {
      title: "Contatti e Iscrizioni",
      navbar: "partials/navbar-accademia",
      success: true,
      corsi: JSON.parse(
        readFileSync(path.join(__dirname, "../data/corsi.json"))
      ),
    });
  } catch (error) {
    console.error("Errore invio email:", error);
    res.render("accademia/contatti", {
      title: "Contatti e Iscrizioni",
      navbar: "partials/navbar-accademia",
      success: false,
      corsi: JSON.parse(
        readFileSync(path.join(__dirname, "../data/corsi.json"))
      ),
    });
  }
};
