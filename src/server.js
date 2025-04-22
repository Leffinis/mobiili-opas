import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// нужно вручную определить __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());

const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

app.get("/places/:category", (req, res) => {
  const category = req.params.category;

  db.all(
    "SELECT name, latitude, longitude FROM places WHERE category = ?",
    [category],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
