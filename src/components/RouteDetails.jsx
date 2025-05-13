import React, { useContext } from "react";
import { LanguageContext } from "../components/LanguageContext";
import { MdDirectionsBus, MdTrain, MdTram, MdSubway, MdDirectionsWalk, MdDirectionsBoat } from "react-icons/md";
import "./RouteDetails.css";

const modeIcon = {
  WALK: <MdDirectionsWalk className="icon walk" />,    // Пешком
  BUS: <MdDirectionsBus className="icon bus" />,       // Автобус
  TRAM: <MdTram className="icon tram" />,               // Трамвай
  SUBWAY: <MdSubway className="icon subway" />,        // Метро
  RAIL: <MdTrain className="icon rail" />,             // Поезд
  FERRY: <MdDirectionsBoat className="icon ferry" />,  // Паром
};

const RouteDetails = ({ legs }) => {
  const { t } = useContext(LanguageContext);
  if (!legs || legs.length === 0) return null;

  const departure = new Date(legs[0].startTime);
  const arrival = new Date(legs[legs.length - 1].endTime);
  const durationMin = Math.round((arrival - departure) / 60000);
  const transfers = legs.filter((leg) => leg.mode !== "WALK").length - 1;

  return (
    <div className="route-details-panel">
      <div className="summary">
        <div>
          <strong>{t.route_departure}:</strong> {departure.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div>
          <strong>{t.route_arrival}:</strong> {arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div>
          <strong>{t.route_duration}:</strong> {durationMin} {t.minutes}
        </div>
        <div>
          <strong>{t.route_transfers}:</strong> {transfers}
        </div>
      </div>
      <ul className="legs-list">
        {legs.map((leg, idx) => (
          <li key={idx} className="leg-item">
            <div className="leg-header">
              {modeIcon[leg.mode] || <MdDirectionsWalk className="icon walk" />}
              <span className="route-name">{leg.route || ""}</span>
              <span className="leg-times">
                {new Date(leg.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {" "}
                {new Date(leg.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="leg-stops">
              <div className="stop">
                <span className="stop-label">{t.route_from}:</span> {leg.from}
              </div>
              <div className="stop">
                <span className="stop-label">{t.route_to}:</span> {leg.to}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteDetails;
