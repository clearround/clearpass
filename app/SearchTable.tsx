"use client";

import { useState } from "react";
import { lang, translations } from "./i18n";

const t = translations[lang];

type AccreditationRow = {
  id: number;
  name: string;
  category: string;
  zones: string[];
};

export default function SearchTable({ data }: { data: AccreditationRow[] }) {  const [search, setSearch] = useState("");

  const filtered = data.filter((item) => {
    const text = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(text) ||
      item.category.toLowerCase().includes(text) ||
      item.zones.join(" ").toLowerCase().includes(text)
    );
  });

  return (
    <div>
      <input
        placeholder={t.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 12,
          marginBottom: 20,
          width: "100%",
          maxWidth: 300,
          border: "1px solid #ccc",
          borderRadius: 8,
          fontSize: 15,
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>{t.name}</th>
            <th style={th}>{t.category}</th>
            <th style={th}>{t.access}</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td style={td}>{item.name}</td>
              <td style={td}>{item.category}</td>
              <td style={td}>{item.zones.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  textAlign: "left" as const,
  padding: 12,
  borderBottom: "1px solid #ddd",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #eee",
};