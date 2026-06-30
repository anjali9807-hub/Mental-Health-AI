import React, { useEffect, useState } from "react";
import { getHistory, getInsight } from "../services/api";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {

    const [history, setHistory] = useState([]);
    const [insight, setInsight] = useState({
    insight: "",
    latest_emotion: "",
    latest_score: 0,
    total_entries: 0,
    most_common: ""
});

    useEffect(() => {
        loadData();
        loadInsight();
    }, []);

    const loadData = async () => {
        try {
            const response = await getHistory();
            setHistory(response.data);
        } catch (error) {
            console.error(error);
        }
    };

  const loadInsight = async () => {

    try {

        const response = await getInsight();

        setInsight(response.data);

    } catch (error) {

        console.error(error);

    }

};

    // ===========================
    // Statistics
    // ===========================

    const totalEntries = history.length;

    const averageTrend =
        totalEntries > 0
            ? (
                  history.reduce(
                      (sum, item) => sum + (item.trend || 0),
                      0
                  ) / totalEntries
              ).toFixed(2)
            : "0";

    const latestEmotion =
        totalEntries > 0
            ? history[history.length - 1].emotion
            : "-";

    const highestMood =
        totalEntries > 0
            ? Math.max(
                  ...history.map(item => item.trend || 0)
              ).toFixed(2)
            : "0";

    const lowestMood =
        totalEntries > 0
            ? Math.min(
                  ...history.map(item => item.trend || 0)
              ).toFixed(2)
            : "0";

    const emotionFrequency = {};

    history.forEach((item) => {

        const emotion = item.emotion || "Unknown";

        emotionFrequency[emotion] =
            (emotionFrequency[emotion] || 0) + 1;

    });

    const mostCommonEmotion =
        Object.keys(emotionFrequency).length > 0
            ? Object.keys(emotionFrequency).reduce((a, b) =>
                  emotionFrequency[a] > emotionFrequency[b]
                      ? a
                      : b
              )
            : "-";

    // ===========================
    // Line Chart
    // ===========================

    const chartData = {

    labels: history.map((_, index) => `Mood ${index + 1}`),

    datasets: [

        {

            label: "Mood Score",

            data: history.map(item => item.mood_score || 0),

            borderColor: "#4CAF50",

            backgroundColor: "rgba(76,175,80,0.3)",

            tension: 0.4

        },

        {

            label: "Predicted Trend",

            data: history.map(item => item.trend || 0),

            borderColor: "#2196F3",

            backgroundColor: "rgba(33,150,243,0.3)",

            tension: 0.4

        }

    ]

};

    // ===========================
    // Pie Chart
    // ===========================

    const emotionCounts = {};

    history.forEach((item) => {

        const emotion = item.emotion || "Unknown";

        emotionCounts[emotion] =
            (emotionCounts[emotion] || 0) + 1;

    });

    const pieData = {

        labels: Object.keys(emotionCounts),

        datasets: [

            {

                label: "Emotion Distribution",

                data: Object.values(emotionCounts),

                backgroundColor: [

                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40"

                ]

            }

        ]

    };
// ===========================
// Recent Activity
// ===========================

const recentEntries = [...history]
    .sort(
        (a, b) =>
            new Date(b.created_at || 0) -
            new Date(a.created_at || 0)
    )
    .slice(0, 5);

    const getEmotionEmoji = (emotion) => {

    switch (emotion) {

        case "joy":
            return "😊";

        case "love":
            return "❤️";

        case "surprise":
            return "😲";

        case "fear":
            return "😨";

        case "sadness":
            return "😢";

        case "anger":
            return "😠";

        default:
            return "🙂";
    }

};

const getEmotionColor = (emotion) => {

    switch (emotion) {

        case "joy":
            return "#4CAF50";

        case "love":
            return "#E91E63";

        case "surprise":
            return "#FF9800";

        case "fear":
            return "#2196F3";

        case "sadness":
            return "#607D8B";

        case "anger":
            return "#F44336";

        default:
            return "#9E9E9E";
    }

};

    return (

        <div style={{ padding: "40px" }}>

            <h1>📊 Dashboard</h1>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginTop: "30px"
                }}
            >

                <div style={createCardStyle("#1976D2")}>
                    <h2>Total Entries</h2>
                    <h1>{totalEntries}</h1>
                </div>

                <div style={createCardStyle("#2E7D32")}>
                    <h2>Average Mood</h2>
                    <h1>{averageTrend}</h1>
                </div>

                <div style={createCardStyle("#EF6C00")}>
                    <h2>Latest Emotion</h2>
                    <h1>{latestEmotion}</h1>
                </div>

                <div style={createCardStyle("#8E24AA")}>
                    <h2>Most Common Emotion</h2>
                    <h1>{mostCommonEmotion}</h1>
                </div>

                <div style={createCardStyle("#C62828")}>
                    <h2>Highest Mood</h2>
                    <h1>{highestMood}</h1>
                </div>

                <div style={createCardStyle("#00838F")}>
                    <h2>Lowest Mood</h2>
                    <h1>{lowestMood}</h1>
                </div>

            </div>

            <div
                style={{
                    marginTop: "50px",
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
            >

                <h2>Mood Score vs Predicted Trend</h2>

                <Line data={chartData} />

            </div>

            <div
                style={{
                    marginTop: "60px",
                    width: "400px",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
            >

                <h2>Emotion Distribution</h2>

                <Pie data={pieData} />

            </div>

         <div
    style={{
        marginTop: "60px",
        padding: "30px",
        borderRadius: "15px",
        background: "#F4F8FF",
        boxShadow: "0 5px 15px rgba(0,0,0,0.15)"
    }}
>

    <h2
        style={{
            textAlign: "center",
            marginBottom: "25px"
        }}
    >
        🧠 AI Wellness Summary
    </h2>

    <div
        style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px"
        }}
    >

        <div>

            <h3>😊 Current Emotion</h3>

            <p
                style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textTransform: "capitalize"
                }}
            >
               <span
    style={{
        color: getEmotionColor(insight.latest_emotion)
    }}
>
    {getEmotionEmoji(insight.latest_emotion)}{" "}
    {insight.latest_emotion}
</span>
            </p>

        </div>

        <div>

            <h3>📈 Mood Score</h3>

            <p
                style={{
                    fontSize: "20px",
                    fontWeight: "bold"
                }}
            >
                {Number(insight.latest_score).toFixed(2)}
            </p>

        </div>

        <div>

            <h3>📅 Total Check-ins</h3>

            <p
                style={{
                    fontSize: "20px",
                    fontWeight: "bold"
                }}
            >
                {insight.total_entries}
            </p>

        </div>

        <div>

            <h3>🏆 Most Common Emotion</h3>

            <p
                style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textTransform: "capitalize"
                }}
            >
                <span
    style={{
        color: getEmotionColor(insight.most_common)
    }}
>
    {getEmotionEmoji(insight.most_common)}{" "}
    {insight.most_common}
</span>
            </p>

        </div>

    </div>

    <hr style={{ margin: "30px 0" }} />

    <h3>💡 AI Recommendation</h3>

    <p
        style={{
            fontSize: "18px",
            lineHeight: "1.8"
        }}
    >
        {insight.insight}
    </p>

</div>
        <div
    style={{
        marginTop: "60px",
        padding: "25px",
        background: "#fafafa",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    }}
>

    <h2>🕒 Recent Activity</h2>

    {recentEntries.length === 0 ? (

        <p>No mood history available.</p>

    ) : (

        recentEntries.map((item, index) => (

            <div
                key={index}
                style={{
                    padding: "15px",
                    borderBottom: "1px solid #ddd"
                }}
            >

                <h3>
                    {item.emotion || "Unknown"}
                </h3>

                <p>
                    {item.text || "-"}
                </p>

                <small>
                    {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "-"}
                </small>

            </div>

        ))

    )}

</div>

        </div>

    );

}

const createCardStyle = (color) => ({
    width: "250px",
    padding: "22px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
    textAlign: "center",
    background: color,
    color: "white",
    transition: "0.3s"
});

export default Dashboard;