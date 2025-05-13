import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import path from "path";
import fetch from "node-fetch";
import polyline from "@mapbox/polyline";  // npm install @mapbox/polyline
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Разрешаем запросы с вашего фронтенда (Vite на 5173)
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Эндпоинт для мест из БД
const db = new sqlite3.Database(path.join(__dirname, "database.db"));
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

// Прокси-эндпоинт для маршрутов (Routing v2)
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
              from { name }
              to   { name }
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
          "digitransit-subscription-key": "5562e21591b84892b3d3c5899b563d15",
        },
        body: JSON.stringify({ query: graphqlQuery }),
      }
    );

    if (!dgResp.ok) throw new Error(`${dgResp.status} ${dgResp.statusText}`);
    const dgJson = await dgResp.json();
    if (dgJson.errors) throw new Error(JSON.stringify(dgJson.errors));

    const itineraries = dgJson.data.plan.itineraries;
    // Декодируем полилинию и используем координаты в формате [lat, lng]
    const processed = itineraries.map((itin) => ({
      legs: itin.legs.map((leg) => {
        const coords = polyline.decode(leg.legGeometry.points); // [[lat, lng], ...]
        return {
          mode:      leg.mode,
          route:     leg.route?.shortName || null,
          startTime: leg.startTime,
          endTime:   leg.endTime,
          from:      leg.from.name,
          to:        leg.to.name,
          geometry:  { coordinates: coords },
        };
      }),
    }));

    res.json(processed);
  } catch (err) {
    console.error("Route proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
