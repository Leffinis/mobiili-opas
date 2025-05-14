import React, { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import {
  MdDirectionsBus,
  MdTrain,
  MdTram,
  MdDirectionsWalk,
  MdDirectionsBoat,
} from "react-icons/md";
import "./RouteDetails.css";

const modeIcon = {
  BUS:    { icon: <MdDirectionsBus />,   cls: "bus"    },
  RAIL:   { icon: <MdTrain />,           cls: "rail"   },
  TRAM:   { icon: <MdTram />,            cls: "tram"   },
  WALK:   { icon: <MdDirectionsWalk />,  cls: "walk"   },
  FERRY:  { icon: <MdDirectionsBoat />,  cls: "ferry"  },
  SUBWAY: { icon: <MdTrain />,           cls: "subway" },
};

// Вспомогательная функция для форматирования времени без секунд
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const RouteDetails = ({ legs }) => {
  const { t } = useContext(LanguageContext);
  if (!Array.isArray(legs) || legs.length === 0) return null;

  // Переводы для типов транспорта
  const modeLabels = {
    WALK:   t.mode_walk,
    BUS:    t.mode_bus,
    RAIL:   t.mode_rail,
    TRAM:   t.mode_tram,
    FERRY:  t.mode_ferry,
    SUBWAY: t.mode_subway,
  };

  // Общая сводка
  const depTime = formatTime(legs[0].startTime);
  const arrTime = formatTime(legs[legs.length - 1].endTime);
  const durationMin = Math.round(
    (new Date(legs[legs.length - 1].endTime) - new Date(legs[0].startTime)) / 60000
  );
  const transfers = Math.max(legs.filter((l) => l.mode !== "WALK").length - 1, 0);

  return (
    <div className="route-details-panel">
      <div className="summary">
        <div>
          <strong>{t.route_departure}:</strong> {depTime}
        </div>
        <div>
          <strong>{t.route_arrival}:</strong> {arrTime}
        </div>
        <div>
          <strong>{t.route_duration}:</strong> {durationMin} {t.minutes}
        </div>
        <div>
          <strong>{t.route_transfers}:</strong> {transfers}
        </div>
      </div>

      <ul className="legs-list">
        {legs.map((leg, i) => {
          const m = modeIcon[leg.mode] || {};
          const label = modeLabels[leg.mode] || leg.mode;
          return (
            <li key={i} className={`leg-item ${m.cls}`}>
              <div className="leg-header">
                <span className={`icon ${m.cls}`}>{m.icon}</span>
                <span className="route-name">
                  {label} {leg.route || ""}
                </span>
                <span className="leg-times">
                  {formatTime(leg.startTime)}–{formatTime(leg.endTime)}
                </span>
              </div>
              <div className="leg-stops">
                <div className="stop">
                  <span className="stop-label">{t.route_from}:</span>{" "}
                  {leg.from.name}
                  {leg.from.platform && ` (${t.route_platform} ${leg.from.platform})`}
                </div>
                <div className="stop">
                  <span className="stop-label">{t.route_to}:</span>{" "}
                  {leg.to.name}
                  {leg.to.platform && ` (${t.route_platform} ${leg.to.platform})`}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RouteDetails;
