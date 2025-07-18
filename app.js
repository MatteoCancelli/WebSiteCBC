// === app.js ===
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";

// Importa le routes
import bandaRoutes from "./routes/banda.js";
import accademiaRoutes from "./routes/accademia.js";

const app = express();
const port = 3005;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Usa le routes organizzate per sezione
app.use("/", bandaRoutes);
app.use("/accademia", accademiaRoutes);

app.listen(port, () => {
  console.log(`\uD83C\uDFB6 Server avviato su http://localhost:${port}`);
});