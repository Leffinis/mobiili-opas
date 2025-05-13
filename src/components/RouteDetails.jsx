import React, { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import {
  MdDirectionsBus,
  MdTrain,
  MdTram,
  MdDirectionsWalk,
  MdDirectionsBoat,
} from "react-icons/md";
import "./RouteDetails.css"; // обязательно импортируем стили

const modeIcon = {
  BUS: { icon: <MdDirectionsBus />,    cls: "bus"    },
  RAIL: { icon: <MdTrain />,           cls: "rail"   },
  TRAM: { icon: <MdTram />,            cls: "rail"   },
  WALK: { icon: <MdDirectionsWalk />,  cls: "walk"   },
  FERRY: { icon: <MdDirectionsBoat />, cls: "rail"   },
  SUBWAY: { icon: <MdTrain />,         cls: "subway" },
};

const RouteDetails = ({ legs }) => {
  const { t } = useContext(LanguageContext);
  if (!Array.isArray(legs) || legs.length === 0) return null;

  // Сводка
  const depTime = new Date(legs[0].startTime).toLocaleTimeString();
  const arrTime = new Date(legs[legs.length - 1].endTime).toLocaleTimeString();
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
          const mi = modeIcon[leg.mode] || {};
          return (
            <li key={i} className="leg-item">
              <div className="leg-header">
                <span className={`icon ${mi.cls || ""}`}>{mi.icon}</span>
                <span className="route-name">
                  {leg.mode} {leg.route || ""}
                </span>
                <span className="leg-times">
                  {new Date(leg.startTime).toLocaleTimeString()}–{new Date(leg.endTime).toLocaleTimeString()}
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
