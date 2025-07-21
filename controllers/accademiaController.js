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
  const dataPath = path.join(__dirname, "../data/corsi.json");
  const corsi = JSON.parse(readFileSync(dataPath));

  const corso = corsi.find(c => c.tag === id);

  if (!corso) return res.status(404).render("404");

  res.render("accademia/corso", { corso,
  title: corso.titolo,
  navbar: "partials/navbar-accademia" });
};

// export const mostraInsegnante = (req, res) => {
//   const id = req.query.id;
//   const dataPath = path.join(__dirname, "../data/insegnante.json");
//   const corsi = JSON.parse(readFileSync(dataPath));

//   const corso = corsi.find(c => c.tag === id);

//   if (!corso) return res.status(404).render("404");

//   res.render("accademia/insegnante", { insegnante,
//   title: insegnante.nome,
//   navbar: "partials/navbar-accademia" });
// };