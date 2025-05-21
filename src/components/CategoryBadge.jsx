// src/components/CategoryBadge.jsx

import React, { useContext } from "react";
import { LanguageContext } from "./LanguageContext";

export default function CategoryBadge({ category }) {
  const { t } = useContext(LanguageContext);

  const label = t[category] || category;
  return <span className="category-badge">{label}</span>;
}
