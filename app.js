// === app.js ===
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";

// Importa le routes
import bandaRoutes from "./routes/banda.js";
import accademiaRoutes from "./routes/accademia.js";

const app = express();
const port = process.env.PORT || 3000; // Render assegna la porta via env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// === Health check route per Render ===
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Usa le routes organizzate per sezione
app.use("/", bandaRoutes);
app.use("/accademia", accademiaRoutes);

app.listen(port, () => {
  console.log(`🎶 Server avviato su http://localhost:${port}`);
});

// Serve file statici dalla root per sitemap.xml
app.use(express.static('./', { 
  index: false, // Non servire index.html dalla root
  dotfiles: 'ignore'
}));

// Oppure solo per la sitemap
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});
