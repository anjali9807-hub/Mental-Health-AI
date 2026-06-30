from tensorflow.keras.models import load_model
import numpy as np
import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "lstm_model.keras")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

# Load model and scaler once
model = load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


def predict_trend(mood_history):

    mood_history = np.array(
        mood_history,
        dtype=float
    ).reshape(-1, 1)

    # Scale input
    scaled_history = scaler.transform(mood_history)

    # Shape for LSTM
    scaled_history = scaled_history.reshape(
        1,
        len(scaled_history),
        1
    )

    # Predict
    prediction = model.predict(
        scaled_history,
        verbose=0
    )

    # Convert back to original scale
    prediction = scaler.inverse_transform(prediction)

    return float(prediction[0][0])