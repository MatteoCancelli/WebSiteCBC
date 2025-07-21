import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

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

  const corso = corsi.find(c => c.tag === id);
  if (!corso) return res.status(404).render("404");

  // Mappa tag → oggetti insegnanti
  const insegnantiCorso = corso.insegnanti.map(tag =>
    insegnanti.find(i => i.tag === tag)
  );

  res.render("accademia/corso", {
    corso,
    insegnanti: insegnantiCorso,
    title: corso.titolo,
    navbar: "partials/navbar-accademia"
  });
};


export const mostraInsegnante = (req, res) => {
  const id = req.query.id;
  const dataPath = path.join(__dirname, "../data/insegnanti.json");
  const insegnanti = JSON.parse(readFileSync(dataPath));

  const insegnante = insegnanti.find(i => i.tag === id);

  if (!insegnante) return res.status(404).render("404");

  res.render("accademia/insegnante", {
    insegnante,
    title: insegnante.nome,
    navbar: "partials/navbar-accademia"
  });
};
