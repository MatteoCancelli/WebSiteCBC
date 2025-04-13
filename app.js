import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate"; // 👈 importa

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔧 Usa ejs-mate come motore
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Rotte banda
app.get("/", (req, res) => {
  res.render("banda/index", {
    title: "Banda Musicale",
    navbar: "partials/navbar-banda",
  });
});

app.get("/eventi", (req, res) => {
  res.render("banda/eventi", {
    title: "Eventi",
    navbar: "partials/navbar-banda",
  });
});

// Rotte accademia
app.get("/accademia", (req, res) => {
  res.render("accademia/index", {
    title: "Accademia Musicale",
    navbar: "partials/navbar-accademia",
  });
});

app.get("/accademia/corsi", (req, res) => {
  res.render("accademia/corsi", {
    title: "Corsi",
    navbar: "partials/navbar-accademia",
  });
});

app.listen(port, () => {
  console.log(`🎶 Sito Banda-Accademia online su http://localhost:${port}`);
});
