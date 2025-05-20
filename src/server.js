import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import path from "path";
import fetch from "node-fetch";
import polyline from "@mapbox/polyline";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const SECRET_KEY = "PasswordForDatabasesAccessTuomasLohAliakseiIdiotCykaPerkele"; // Поменяй на свою длинную строку!

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, "database.db"));


// --- РЕГИСТРАЦИЯ пользователя (POST /api/register)
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Täytä kaikki kentät" });
  const hash = await bcrypt.hash(password, 10);
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hash],
    function (err) {
      if (err) return res.status(400).json({ error: "Käyttäjänimi on varattu" });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// --- ЛОГИН (POST /api/login)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err || !user)
        return res.status(401).json({ error: "Väärä käyttäjätunnus tai salasana" });
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: "Väärä käyttäjätunnus tai salasana" });

      // Генерируем токен (JWT)
      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: "24h" }
      );
      res.json({ token, username: user.username });
    }
  );
});

// --- Мидлвар для проверки токена (для защищённых маршрутов)
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// --- Пример защищённого эндпоинта (можно использовать для /omatsivut и т.п.)
app.get("/api/profile", authenticateToken, (req, res) => {
  res.json({ message: "Tervetuloa, " + req.user.username + "!", user: req.user });
});

// --- ТВОИ СТАРЫЕ ЭНДПОИНТЫ (places, route) остаются как были:

// --- МЕСТА (places)
app.get("/places/:category", (req, res) => {
  db.all(
    "SELECT * FROM places WHERE category = ?",
    [req.params.category],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// --- ПРОКСИ ДЛЯ МАРШРУТА (routing)
app.post("/api/route", async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.body;
    const graphqlQuery = `
      {
        plan(
          fromPlace: "${fromLat},${fromLng}",
          toPlace: "${toLat},${toLng}",
          numItineraries: 1
        ) {
          itineraries {
            legs {
              mode
              startTime
              endTime
              from {
                name
                stop { platformCode }
              }
              to {
                name
                stop { platformCode }
              }
              route { shortName }
              legGeometry { points }
            }
          }
        }
      }
    `;
    const dgResp = await fetch(
      "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "digitransit-subscription-key": "df740b887fa6454a9f6f714a8d4a1cf2",
        },
        body: JSON.stringify({ query: graphqlQuery }),
      }
    );
    if (!dgResp.ok) throw new Error(`${dgResp.status} ${dgResp.statusText}`);
    const { data, errors } = await dgResp.json();
    if (errors) throw new Error(JSON.stringify(errors));
    const legs = data.plan.itineraries[0].legs;

    const result = legs.map((leg) => {
      const coords = polyline.decode(leg.legGeometry.points); // [[lat,lng],...]
      return {
        mode:      leg.mode,
        route:     leg.route?.shortName || null,
        startTime: leg.startTime,
        endTime:   leg.endTime,
        from: {
          name:     leg.from.name,
          platform: leg.from.stop?.platformCode || null,
        },
        to: {
          name:     leg.to.name,
          platform: leg.to.stop?.platformCode || null,
        },
        geometry: { coordinates: coords },  // Leaflet ждёт [lat, lng]
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Route proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
