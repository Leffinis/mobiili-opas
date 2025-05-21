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
const SECRET_KEY = "PasswordForDatabasesAccessTuomasLohAliakseiIdiotCykaPerkele"; // 

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, "database.db"));


// (POST /api/register) REGISTER
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

// LOGIN
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

      // Token luodaan ja lähetetään asiakkaalle
      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: "24h" }
      );
      res.json({ token, username: user.username });
    }
  );
});

// --- TÄMÄ FUNKTIO KÄYTETÄÄN SUOJATUILLE ENDPOINTEILLE
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

// --- PROFIILI (profile)
app.get("/api/profile", authenticateToken, (req, res) => {
  res.json({ message: "Tervetuloa, " + req.user.username + "!", user: req.user });
});



// --- (places)
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

// --- routing
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
// fetch places
app.get("/api/bookmarks", authenticateToken, (req, res) => {
  db.all(
    "SELECT place_id FROM bookmarks WHERE user_id = ?",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const ids = rows.map(r => r.place_id);
      res.json(ids);
    }
  );
});

// Lisää uusi bookmark
app.post("/api/bookmarks/:placeId", authenticateToken, (req, res) => {
  const placeId = req.params.placeId;
  db.run(
    "INSERT OR IGNORE INTO bookmarks (user_id, place_id) VALUES (?, ?)",
    [req.user.id, placeId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// poista bookmark
app.delete("/api/bookmarks/:placeId", authenticateToken, (req, res) => {
  const placeId = req.params.placeId;
  db.run(
    "DELETE FROM bookmarks WHERE user_id = ? AND place_id = ?",
    [req.user.id, placeId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
