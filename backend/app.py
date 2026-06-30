from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

from backend.predict import predict_emotion
from backend.database import collection
from backend.trend import predict_trend
from backend.insights import generate_insight
from backend.crisis import detect_crisis
emotion_scores = {
    "joy": 0.90,
    "love": 0.85,
    "surprise": 0.75,
    "fear": 0.40,
    "sadness": 0.30,
    "anger": 0.20
}

# Create FastAPI app
app = FastAPI(
    title="AI Mental Health Companion API",
    description="Backend API for emotion prediction and mood tracking",
    version="1.0.0"
)

# -------------------------------
# CORS Configuration
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Request Model
# -------------------------------
class UserInput(BaseModel):
    text: str
    mood_history: list[float]


# -------------------------------
# Home Route
# -------------------------------
@app.get("/")
def home():
    return {
        "message": "AI Mental Health Companion Backend is Running!"
    }


# -------------------------------
# Prediction Route
# -------------------------------
# -------------------------------
# Prediction Route
# -------------------------------
@app.post("/predict")
def predict(data: UserInput):

    # Check for crisis first
    if detect_crisis(data.text):

        return {
            "crisis": True,
            "message": (
                "⚠️ Your message suggests you may be going through a very difficult time.\n\n"
                "Please contact a trusted family member or friend as soon as possible.\n\n"
                "If you feel you are in immediate danger of harming yourself, call your local emergency services or go to the nearest emergency department.\n\n"
                "A mental health professional can also provide support."
            )
        }

    # Predict emotion
    emotion = predict_emotion(data.text)
   

    # Convert emotion to mood score
    mood_score = emotion_scores.get(emotion, 0.60)

    # Get previous mood history
    history_scores = data.mood_history

    # If we don't have enough history yet,
    # don't use the LSTM.
    if len(history_scores) < 7:

        trend = mood_score

    else:

        # Only use the latest 7 mood scores
        trend = predict_trend(history_scores[-7:])

    # Save into MongoDB
    collection.insert_one({
        "text": data.text,
        "emotion": emotion,
        "mood_score": mood_score,
        "trend": float(trend),
        "created_at": datetime.now()
    })

    return {
        "text": data.text,
        "predicted_emotion": emotion,
        "predicted_mood_score": mood_score,
        "predicted_trend": round(float(trend), 2)
    }

# -------------------------------
# History Route
# -------------------------------
@app.get("/history")
def history():

    data = list(collection.find({}, {"_id": 0}))

    return data


# -------------------------------
# Insight Route
# -------------------------------
@app.get("/insight")
def insight():

    history = list(collection.find({}, {"_id": 0}))

    if len(history) == 0:

        return {
            "insight": "No mood history available.",
            "latest_emotion": "-",
            "latest_score": 0,
            "total_entries": 0,
            "most_common": "-"
        }

    message = generate_insight(history)

    latest = history[-1]

    emotion_counts = {}

    for item in history:

        emotion = item.get("emotion", "Unknown")

        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

    most_common = max(
        emotion_counts,
        key=emotion_counts.get
    )

    return {

        "insight": message,

        "latest_emotion": latest.get("emotion"),

        "latest_score": latest.get("mood_score"),

        "total_entries": len(history),

        "most_common": most_common

    }