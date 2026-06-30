import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await getHistory();
      setHistory(response.data);
    } catch (error) {
      console.error(error);
      alert("Cannot load history");
    }
  };
  const exportCSV = () => {

    const headers = [
        "Date",
        "Text",
        "Emotion",
        "Trend"
    ];

    const rows = sortedHistory.map(item => [

        item.created_at
            ? new Date(item.created_at).toLocaleString()
            : "",

        item.text || "",

        item.emotion || "",

        item.trend || ""

    ]);

    const csvContent = [

        headers,

        ...rows

    ]
        .map(e => e.join(","))

        .join("\n");

    const blob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    saveAs(blob, "Mood_History.csv");

};
const exportPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("AI Mental Health Companion", 14, 15);

    doc.setFontSize(12);

    doc.text("Mood History Report", 14, 25);

    autoTable(doc, {

        startY: 35,

        head: [[
            "Date",
            "Text",
            "Emotion",
            "Trend"
        ]],

        body: sortedHistory.map(item => [

            item.created_at
                ? new Date(item.created_at).toLocaleString()
                : "",

            item.text || "",

            item.emotion || "",

            item.trend
                ? Number(item.trend).toFixed(2)
                : ""

        ])

    });

    doc.save("Mood_History.pdf");

};

  // Search + Filter
  const filteredHistory = history.filter((item) => {
    const text = item.text || "";
    const emotion = item.emotion || "";

    const matchesSearch = text
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesEmotion =
      emotionFilter === "All" ||
      emotion === emotionFilter;

    return matchesSearch && matchesEmotion;
  });

  // Sorting
  const sortedHistory = [...filteredHistory];

  switch (sortOption) {
    case "Newest":
      sortedHistory.sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      );
      break;

    case "Oldest":
      sortedHistory.sort(
        (a, b) =>
          new Date(a.created_at || 0) -
          new Date(b.created_at || 0)
      );
      break;

    case "Highest":
      sortedHistory.sort(
        (a, b) =>
          (b.trend || 0) - (a.trend || 0)
      );
      break;

    case "Lowest":
      sortedHistory.sort(
        (a, b) =>
          (a.trend || 0) - (b.trend || 0)
      );
      break;

    default:
      break;
  }

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h1>Mood History</h1>

      <br />

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by text..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "320px",
          padding: "10px",
          fontSize: "16px",
          marginRight: "20px",
          borderRadius: "6px"
        }}
      />

      {/* Emotion Filter */}
      <select
        value={emotionFilter}
        onChange={(e) => setEmotionFilter(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          marginRight: "20px"
        }}
      >
        <option value="All">All Emotions</option>
        <option value="joy">Joy</option>
        <option value="sadness">Sadness</option>
        <option value="anger">Anger</option>
        <option value="fear">Fear</option>
        <option value="love">Love</option>
        <option value="surprise">Surprise</option>
      </select>

      {/* Sort */}
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px"
        }}
      >
        <option value="Newest">Newest First</option>
        <option value="Oldest">Oldest First</option>
        <option value="Highest">Highest Mood</option>
        <option value="Lowest">Lowest Mood</option>
      </select>

      <br />
      <br />
      <button
    onClick={exportCSV}
    style={{
        padding: "10px 20px",
        marginBottom: "20px",
        borderRadius: "6px",
        cursor: "pointer"
    }}
>
    ⬇ Download CSV
</button>

<button
    onClick={exportPDF}
    style={{
        padding: "10px 20px",
        marginLeft: "15px",
        borderRadius: "6px",
        cursor: "pointer"
    }}
>
    📄 Download PDF
</button>
<br />
<br />
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left"
        }}
      >
        <thead
          style={{
            backgroundColor: "#f0f0f0"
          }}
        >
          <tr>
            <th>Date</th>
            <th>Text</th>
            <th>Emotion</th>
            <th>Trend</th>
          </tr>
        </thead>

        <tbody>
          {sortedHistory.length > 0 ? (
            sortedHistory.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "-"}
                </td>

                <td>{item.text || "-"}</td>

                <td>
    <span
        style={{
            background:
                item.emotion === "joy"
                    ? "#4CAF50"
                    : item.emotion === "sadness"
                    ? "#2196F3"
                    : item.emotion === "anger"
                    ? "#F44336"
                    : item.emotion === "fear"
                    ? "#FF9800"
                    : item.emotion === "love"
                    ? "#E91E63"
                    : "#9E9E9E",

            color: "white",

            padding: "6px 12px",

            borderRadius: "20px",

            fontWeight: "bold",

            display: "inline-block",

            minWidth: "90px",

            textAlign: "center",

            textTransform: "capitalize"
        }}
    >
        {item.emotion || "-"}
    </span>
</td>

                <td>
    <span
        style={{
            color:
                item.trend >= 0.75
                    ? "#2E7D32"
                    : item.trend >= 0.40
                    ? "#EF6C00"
                    : "#C62828",

            fontWeight: "bold"
        }}
    >
        {item.trend !== undefined &&
        item.trend !== null
            ? Number(item.trend).toFixed(2)
            : "-"}
    </span>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  padding: "20px"
                }}
              >
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default History;